
//updating this 


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { Product, SubCategory } from '@/app/models/cropcare';
import { deleteFile } from '../../../lib/multer';

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
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
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const subCategoryId = formData.get('subCategoryId') as string;
    const status = formData.get('status') as string || 'active';
    
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product name is required' 
      }, { status: 400 });
    }
    
    if (!subCategoryId) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory ID is required' 
      }, { status: 400 });
    }
    
    // Check if subcategory exists
    const subcategoryExists = await SubCategory.findById(subCategoryId);
    if (!subcategoryExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory not found' 
      }, { status: 404 });
    }
    
    // Parse target pests/diseases
    const targetPestsDiseasesData = formData.get('targetPestsDiseases') as string;
    let targetPestsDiseases = [];
    if (targetPestsDiseasesData) {
      targetPestsDiseases = JSON.parse(targetPestsDiseasesData);
    }
    
    // Parse recommended seeds
    const recommendedSeedsData = formData.get('recommendedSeeds') as string;
    let recommendedSeeds = [];
    if (recommendedSeedsData) {
      recommendedSeeds = JSON.parse(recommendedSeedsData);
    }
    
    // Process image uploads for target pests/diseases
    for (let i = 0; i < targetPestsDiseases.length; i++) {
      const pest = targetPestsDiseases[i];
      if (pest.imageFile) {
        // This would be handled client-side by converting file to base64 or URL
        // For now, we'll expect the client to send the image URL
        delete pest.imageFile; // Remove the file object
      }
    }
    
    // Process image uploads for recommended seeds
    for (let i = 0; i < recommendedSeeds.length; i++) {
      const seed = recommendedSeeds[i];
      if (seed.imageFile) {
        delete seed.imageFile; // Remove the file object
      }
    }
    
    const product = await Product.create({
      name: name.trim(),
      subCategoryId: subCategoryId,
      targetPestsDiseases: targetPestsDiseases,
      recommendedSeeds: recommendedSeeds,
      status: status
    });
    
    console.log('Product created successfully:', product._id);
    
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
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const subCategoryId = formData.get('subCategoryId') as string;
    const status = formData.get('status') as string;
    
    // Parse arrays
    const targetPestsDiseasesData = formData.get('targetPestsDiseases') as string;
    let targetPestsDiseases = [];
    if (targetPestsDiseasesData) {
      targetPestsDiseases = JSON.parse(targetPestsDiseasesData);
    }
    
    const recommendedSeedsData = formData.get('recommendedSeeds') as string;
    let recommendedSeeds = [];
    if (recommendedSeedsData) {
      recommendedSeeds = JSON.parse(recommendedSeedsData);
    }
    
    const updateData: any = {
      name: name?.trim(),
      subCategoryId: subCategoryId,
      targetPestsDiseases: targetPestsDiseases,
      recommendedSeeds: recommendedSeeds,
      status: status || 'active'
    };
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
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
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    // Delete images from target pests/diseases
    for (const pest of product.targetPestsDiseases) {
      if (pest.image && pest.image.startsWith('/uploads/cropcare/')) {
        const filename = pest.image.split('/').pop();
        await deleteFile(filename || '');
      }
    }
    
    // Delete images from recommended seeds
    for (const seed of product.recommendedSeeds) {
      if (seed.image && seed.image.startsWith('/uploads/cropcare/')) {
        const filename = seed.image.split('/').pop();
        await deleteFile(filename || '');
      }
    }
    
    await Product.findByIdAndDelete(id);
    
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
    
    const product = await Product.findByIdAndUpdate(
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