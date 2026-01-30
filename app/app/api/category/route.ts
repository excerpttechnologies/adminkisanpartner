

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Category from "@/app/models/Category";
import { categoryID } from "@/app/_utils/generateNextId";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadsDir = join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Handle file upload
const handleFileUpload = async (file: File) => {
  await ensureUploadsDir();
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Generate unique filename
  const timestamp = Date.now();
  const originalName = file.name;
  const extension = originalName.split('.').pop();
  const filename = `category_${timestamp}.${extension}`;
  
  const uploadsDir = await ensureUploadsDir();
  const path = join(uploadsDir, filename);
  
  await writeFile(path, buffer);
  return filename;
};

// GET all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      message: "Categories fetched successfully",
      category: categories
    });
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error fetching categories" 
      },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const categoryName = formData.get("categoryName") as string;
    const imageFile = formData.get("image") as File | null;

    if (!categoryName) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 409 }
      );
    }

    // Handle image upload
    let imageFilename = "";
    if (imageFile && imageFile.size > 0) {
      imageFilename = await handleFileUpload(imageFile);
    }

    // Generate category ID
    const categoryId = await categoryID();

    // Create category
    const category = await Category.create({
      categoryId,
      categoryName,
      image: imageFilename,
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category
    }, { status: 201 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error creating category" 
      },
      { status: 500 }
    );
  }
}


// ... existing imports ...

