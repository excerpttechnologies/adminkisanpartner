import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { CropCareSubCategory, CropCareCategory } from '@/app/models';

// GET all subcategories
export async function GET() {
  try {
    await connectDB();
    const subcategories = await CropCareSubCategory.find({})
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: subcategories 
    });
  } catch (error: any) {
    console.error('GET Subcategories Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// CREATE subcategory
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('Creating CropCareSubCategory with data:', body);
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory name is required' 
      }, { status: 400 });
    }
    
    if (!body.categoryId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category ID is required' 
      }, { status: 400 });
    }
    
    // Check if category exists
    const categoryExists = await CropCareCategory.findById(body.categoryId);
    if (!categoryExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'Parent category not found' 
      }, { status: 404 });
    }
    
    const subcategory = await CropCareSubCategory.create({
      name: body.name.trim(),
      image: body.image || '',
      categoryId: body.categoryId,
      status: body.status || 'active'
    });
    
    console.log('CropCareSubCategory created successfully:', subcategory._id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'SubCategory created successfully',
      data: subcategory 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('POST Subcategory Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

// UPDATE subcategory
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    const subcategory = await CropCareSubCategory.findByIdAndUpdate(
      id,
      body,
      { new: true }
    ).populate('categoryId', 'name');
    
    if (!subcategory) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'SubCategory updated successfully',
      data: subcategory 
    });
    
  } catch (error: any) {
    console.error('PUT Subcategory Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// DELETE subcategory
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory ID is required' 
      }, { status: 400 });
    }
    
    const subcategory = await CropCareSubCategory.findByIdAndDelete(id);
    
    if (!subcategory) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'SubCategory deleted successfully' 
    });
    
  } catch (error: any) {
    console.error('DELETE Subcategory Error:', error);
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
        message: 'SubCategory ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    if (!body.status || !['draft', 'active', 'inactive'].includes(body.status)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid status is required' 
      }, { status: 400 });
    }
    
    const subcategory = await CropCareSubCategory.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    ).populate('categoryId', 'name');
    
    if (!subcategory) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'SubCategory status updated successfully',
      data: subcategory 
    });
    
  } catch (error: any) {
    console.error('PATCH Subcategory Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}