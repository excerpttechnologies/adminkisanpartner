// app/api/b2b-products/[id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";

import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import connectDB from "@/app/lib/Db";
import B2BProduct from "@/app/models/B2BProduct.model";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const { images } = await request.json();
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }
    
    const product = await B2BProduct.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    
    // Delete old images from server
    for (const oldImage of product.images) {
      const filename = path.basename(oldImage);
      const imagePath = path.join(process.cwd(), "public/uploads/b2b-products", filename);
      if (existsSync(imagePath)) {
        await unlink(imagePath);
      }
    }
    
    // Update images
    product.images = images;
    await product.save();
    
    return NextResponse.json({
      success: true,
      message: "Product images updated successfully",
      product,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


