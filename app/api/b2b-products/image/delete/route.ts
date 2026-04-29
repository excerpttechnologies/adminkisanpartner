// app/api/b2b-products/image/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import connectDB from "@/app/lib/Db";
import B2BProduct from "@/app/models/B2BProduct.model";


export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("imageUrl");
    const productId = searchParams.get("productId");
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      );
    }
    
    // Delete physical file
    const filename = path.basename(imageUrl);
    const imagePath = path.join(process.cwd(), "public/uploads/b2b-products", filename);
    
    if (existsSync(imagePath)) {
      await unlink(imagePath);
    }
    
    // If productId provided, remove image reference from product
    if (productId) {
      await connectDB();
      await B2BProduct.findByIdAndUpdate(productId, {
        $pull: { images: imageUrl }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}