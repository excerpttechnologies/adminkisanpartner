

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Category from "@/app/models/Category";

// GET single category
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Category fetched successfully",
      category
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { categoryName } = body;

    if (!categoryName || categoryName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if new name conflicts with other categories
    const nameConflict = await Category.findOne({
      _id: { $ne: id },
      categoryName: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') }
    });

    if (nameConflict) {
      return NextResponse.json(
        { success: false, message: "Category name already exists" },
        { status: 409 }
      );
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { 
        categoryName: categoryName.trim(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error updating category" 
      },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error deleting category" 
      },
      { status: 500 }
    );
  }
}