// app/api/b2b-products/bulk-delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import B2BProduct from "@/app/models/B2BProduct.model";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { productIds } = await request.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product IDs are required" },
        { status: 400 }
      );
    }
    
    // Find all products to delete
    const products = await B2BProduct.find({ _id: { $in: productIds } });
    
    if (products.length === 0) {
      return NextResponse.json(
        { success: false, message: "No products found" },
        { status: 404 }
      );
    }
    
    // Delete all images from storage
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          try {
            let filename = "";
            
            if (imageUrl.includes("/api/b2b-products/image/")) {
              filename = imageUrl.split("/api/b2b-products/image/")[1];
            } else if (imageUrl.includes("/uploads/")) {
              filename = imageUrl.split("/uploads/b2b-products/")[1];
            } else {
              const urlParts = imageUrl.split("/");
              filename = urlParts[urlParts.length - 1];
            }
            
            if (filename && !filename.includes("data:") && !filename.includes("http")) {
              const possiblePaths = [
                path.join(process.cwd(), "public/uploads/b2b-products", filename),
                path.join(process.cwd(), "uploads/b2b-products", filename),
              ];
              
              for (const imagePath of possiblePaths) {
                if (existsSync(imagePath)) {
                  await unlink(imagePath);
                  break;
                }
              }
            }
          } catch (error) {
            console.error(`Error deleting image:`, error);
          }
        }
      }
    }
    
    // Delete all products
    await B2BProduct.deleteMany({ _id: { $in: productIds } });
    
    return NextResponse.json({
      success: true,
      message: `${products.length} product(s) deleted successfully`,
    });
    
  } catch (error: any) {
    console.error("Error bulk deleting products:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}