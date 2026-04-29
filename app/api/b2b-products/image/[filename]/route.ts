
// app/api/b2b-products/image/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads/b2b-products");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const filename = (await params).filename;
    
    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }
    
    const imagePath = path.join(UPLOAD_DIR, filename);
    
    if (!existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    const imageBuffer = await readFile(imagePath);
    const ext = path.extname(filename).toLowerCase();
    
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.webp') contentType = 'image/webp';
    if (ext === '.gif') contentType = 'image/gif';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}