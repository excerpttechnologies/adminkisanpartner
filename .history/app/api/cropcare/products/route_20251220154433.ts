import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { C, CropCareSubCategory } from '@/app/models/cropcare';

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await C.find({})
      .populate({
        path: 'subCategoryId',
        select: 'name categoryId',
        populate: {
          path: 'categoryId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: products 
    });
  } catch (error: any) {
    console.error('GET Products Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// CREATE product
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('Creating C with data:', body);
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product name is required' 
      }, { status: 400 });
    }
    
    if (!body.subCategoryId) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory ID is required' 
      }, { status: 400 });
    }
    
    // Check if subcategory exists
    const subcategoryExists = await CropCareSubCategory.findById(body.subCategoryId);
    if (!subcategoryExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory not found' 
      }, { status: 404 });
    }
    
    const product = await C.create({
      name: body.name.trim(),
      subCategoryId: body.subCategoryId,
      targetPestsDiseases: body.targetPestsDiseases || [],
      recommendedSeeds: body.recommendedSeeds || [],
      status: body.status || 'active'
    });
    
    console.log('C created successfully:', product._id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      data: product 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('POST Product Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    const product = await C.findByIdAndUpdate(
      id,
      body,
      { new: true }
    ).populate({
      path: 'subCategoryId',
      select: 'name categoryId',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    });
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: product 
    });
    
  } catch (error: any) {
    console.error('PUT Product Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID is required' 
      }, { status: 400 });
    }
    
    const product = await C.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
    
  } catch (error: any) {
    console.error('DELETE Product Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// PATCH - Update status
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    if (!body.status || !['draft', 'active', 'inactive'].includes(body.status)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid status is required' 
      }, { status: 400 });
    }
    
    const product = await C.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    ).populate({
      path: 'subCategoryId',
      select: 'name categoryId',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    });
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product status updated successfully',
      data: product 
    });
    
  } catch (error: any) {
    console.error('PATCH Product Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}