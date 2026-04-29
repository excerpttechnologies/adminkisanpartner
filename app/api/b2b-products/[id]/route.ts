
// app/api/b2b-products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import B2BProduct from "@/app/models/B2BProduct.model";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// GET - Get single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    // Increment view count
    await B2BProduct.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    
    const product = await B2BProduct.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product,
    });
    
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    
    // Remove fields that shouldn't be updated
    const { verificationStatus, isActive, status, ...updateData } = body;
    
    // Only update allowed fields
    const allowedUpdates: any = {
      productName: updateData.productName,
      description: updateData.description,
      categoryId: updateData.categoryId,
      categoryName: updateData.categoryName,
      subCategoryId: updateData.subCategoryId,
      subCategoryName: updateData.subCategoryName,
      images: updateData.images,
      price: updateData.price,
      quantity: updateData.quantity,
      unit: updateData.unit,
      taluk: updateData.taluk,
    };
    

    // Add optional fields if they exist
    if (isActive !== undefined) allowedUpdates.status = isActive == true ?"active":"inactive";
    if (isActive !== undefined) allowedUpdates.isActive = isActive;
    if (verificationStatus !== undefined) allowedUpdates.verificationStatus = verificationStatus;
    
    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );
    
    const product = await B2BProduct.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
    
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product and its images
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    // Find the product first to get image paths
    const product = await B2BProduct.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    
    // Delete all associated images from storage
    if (product.images && product.images.length > 0) {
      let deletedCount = 0;
      let failedCount = 0;
      
      for (const imageUrl of product.images) {
        try {
          // Extract filename from URL
          let filename = "";
          
          if (imageUrl.includes("/api/b2b-products/image/")) {
            filename = imageUrl.split("/api/b2b-products/image/")[1];
          } else if (imageUrl.includes("/uploads/")) {
            filename = imageUrl.split("/uploads/b2b-products/")[1];
          } else if (imageUrl.includes("data:image")) {
            // Base64 image - no file to delete
            continue;
          } else {
            const urlParts = imageUrl.split("/");
            filename = urlParts[urlParts.length - 1];
          }
          
          if (filename && !filename.includes("data:") && !filename.includes("http")) {
            // Check multiple possible upload directories
            const possiblePaths = [
              path.join(process.cwd(), "public/uploads/b2b-products", filename),
              path.join(process.cwd(), "uploads/b2b-products", filename),
              path.join(process.cwd(), ".next/server/uploads/b2b-products", filename),
            ];
            
            let deleted = false;
            for (const imagePath of possiblePaths) {
              if (existsSync(imagePath)) {
                await unlink(imagePath);
                console.log(`Deleted image: ${imagePath}`);
                deleted = true;
                deletedCount++;
                break;
              }
            }
            
            if (!deleted) {
              console.log(`Image not found: ${filename}`);
              failedCount++;
            }
          }
        } catch (error) {
          console.error(`Error deleting image ${imageUrl}:`, error);
          failedCount++;
        }
      }
      
      console.log(`Deleted ${deletedCount} images, failed: ${failedCount}`);
    }
    
    // Delete the product from database
    await B2BProduct.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
    
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}