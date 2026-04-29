
// app/api/b2b-products/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads/b2b-products");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, message: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    for (const file of files) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) continue;

      if (file.size > 5 * 1024 * 1024) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000000);
      const ext = path.extname(file.name);
      const filename = `${timestamp}-${random}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      
      await writeFile(filepath, buffer);
      uploadedImages.push(`/api/b2b-products/image/${filename}`);
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid images uploaded" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      images: uploadedImages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}