import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public/uploads/ads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const extension = path.extname(file.name);
    const filename = `${uuidv4()}${extension}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filepath, buffer);

    // Generate URL for the uploaded file
    const fileUrl = `/uploads/ads/${filename}`;

    console.log('File uploaded successfully:', {
      filename,
      url: fileUrl,
      size: file.size,
      type: file.type
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
    });

  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json();
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }

    const filepath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filepath)) {
      await fs.promises.unlink(filepath);
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'File not found'
      }, { status: 404 });
    }

  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete file'
      },
      { status: 500 }
    );
  }
}