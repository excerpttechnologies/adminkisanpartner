import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { Category } from '@/app/models/cropcare';
//import { CropCareCategory } from '../../../models/cropcare';

// GET all categories
export async function GET() {
  try {
    await connectD();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error: any) {
    console.error('GET Categories Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// CREATE category
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('Creating CropCareCategory with data:', body);
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category name is required' 
      }, { status: 400 });
    }
    
    const category = await CropCareCategory.create({
      name: body.name.trim(),
      image: body.image || '',
      status: body.status || 'active'
    });
    
    console.log('CropCareCategory created successfully:', category._id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category created successfully',
      data: category 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('POST Category Error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category with this name already exists' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

// UPDATE category
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    const category = await CropCareCategory.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category updated successfully',
      data: category 
    });
    
  } catch (error: any) {
    console.error('PUT Category Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category ID is required' 
      }, { status: 400 });
    }
    
    const category = await CropCareCategory.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
    
  } catch (error: any) {
    console.error('DELETE Category Error:', error);
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
        message: 'Category ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    if (!body.status || !['draft', 'active', 'inactive'].includes(body.status)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid status is required' 
      }, { status: 400 });
    }
    
    const category = await CropCareCategory.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );
    
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category status updated successfully',
      data: category 
    });
    
  } catch (error: any) {
    console.error('PATCH Category Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}