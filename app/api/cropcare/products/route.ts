

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { Product, SubCategory } from '@/app/models/cropcare';
import { deleteFile } from '../../../lib/multer';

// Helper function to upload image file
async function uploadImageFile(imageFile: File): Promise<string> {
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${imageFile.name.substring(imageFile.name.lastIndexOf('.'))}`;
  const imagePath = `/uploads/cropcare/images/${uniqueName}`;
  
  const fs = await import('fs');
  const path = await import('path');
  
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare', 'images');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
  return imagePath;
}

// Helper function to upload video file
async function uploadVideoFile(videoFile: File): Promise<string> {
  const bytes = await videoFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${videoFile.name.substring(videoFile.name.lastIndexOf('.'))}`;
  const videoPath = `/uploads/cropcare/videos/${uniqueName}`;
  
  const fs = await import('fs');
  const path = await import('path');
  
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare', 'videos');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
  return videoPath;
}

// Updated deleteFile helper to handle both images and videos
async function deleteFileHelper(filename: string, type: 'images' | 'videos' = 'images') {
  const fs = await import('fs');
  const path = await import('path');
  
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'cropcare', type, filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
      .populate({
        path: 'subCategoryId',
        select: 'name',
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
    const description = formData.get('description') as string || '';
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
    const subCategoryExists = await SubCategory.findById(subCategoryId);
    if (!subCategoryExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory not found' 
      }, { status: 404 });
    }
    
    // Process video upload
    const videoFile = formData.get('video') as File | null;
    let videoUrl = '';
    if (videoFile && videoFile.size > 0) {
      // Check file size (2MB limit)
      if (videoFile.size > 2 * 1024 * 1024) {
        return NextResponse.json({ 
          success: false, 
          message: 'Video file size must be less than 2MB' 
        }, { status: 400 });
      }
      // Check file type
      if (!videoFile.type.startsWith('video/')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Please upload a valid video file' 
        }, { status: 400 });
      }
      videoUrl = await uploadVideoFile(videoFile);
    }
    
    // Process pest images - upload to server
    const processedPests = [];
    let pestIndex = 0;
    while (formData.has(`pestName_${pestIndex}`)) {
      const pestName = formData.get(`pestName_${pestIndex}`) as string;
      const pestImageFile = formData.get(`pestImage_${pestIndex}`) as File | null;
      
      if (pestName && pestName.trim()) {
        let imageUrl = '';
        if (pestImageFile && pestImageFile.size > 0) {
          imageUrl = await uploadImageFile(pestImageFile);
        }
        
        processedPests.push({
          name: pestName.trim(),
          image: imageUrl
        });
      }
      pestIndex++;
    }
    
    // Process seed data with new fields
    const processedSeeds = [];
    let seedIndex = 0;
    while (formData.has(`seedName_${seedIndex}`)) {
      const seedName = formData.get(`seedName_${seedIndex}`) as string;
      const stock = formData.get(`stock_${seedIndex}`) as string;
      const unit = formData.get(`unit_${seedIndex}`) as string;
      const customUnit = formData.get(`customUnit_${seedIndex}`) as string;
      const weight = formData.get(`weight_${seedIndex}`) as string;
      const weightUnit = formData.get(`weightUnit_${seedIndex}`) as string;
      const listPrice = formData.get(`listPrice_${seedIndex}`) as string;
      const discount = formData.get(`discount_${seedIndex}`) as string;
      const profit = formData.get(`profit_${seedIndex}`) as string;
      const tax = formData.get(`tax_${seedIndex}`) as string;
      const customTax = formData.get(`customTax_${seedIndex}`) as string;
      const finalPrice = formData.get(`finalPrice_${seedIndex}`) as string;
      const seedImageFile = formData.get(`seedImage_${seedIndex}`) as File | null;
      
      if (seedName && seedName.trim()) {
        let imageUrl = '';
        if (seedImageFile && seedImageFile.size > 0) {
          imageUrl = await uploadImageFile(seedImageFile);
        }
        
        processedSeeds.push({
          name: seedName.trim(),
          image: imageUrl,
          stock: parseInt(stock) || 0,
          unit: unit || 'kg',
          customUnit: customUnit || '',
          weight: parseFloat(weight) || 0,
          weightUnit: weightUnit || 'kg',
          listPrice: parseFloat(listPrice) || 0,
          discount: parseFloat(discount) || 0,
          profit: parseFloat(profit) || 0,
          tax: parseFloat(tax) || 18,
          customTax: customTax ? parseFloat(customTax) : undefined,
          finalPrice: parseFloat(finalPrice) || 0
        });
      }
      seedIndex++;
    }
    
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      video: videoUrl,
      subCategoryId: subCategoryId,
      targetPestsDiseases: processedPests,
      recommendedSeeds: processedSeeds,
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
    const description = formData.get('description') as string || '';
    const subCategoryId = formData.get('subCategoryId') as string;
    const status = formData.get('status') as string;
    
    // Get existing product to delete old files if needed
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    // Process video upload
    const videoFile = formData.get('video') as File | null;
    const existingVideo = formData.get('existingVideo') as string | null;
    let videoUrl = existingVideo || '';
    
    if (videoFile && videoFile.size > 0) {
      // Check file size (2MB limit)
      if (videoFile.size > 2 * 1024 * 1024) {
        return NextResponse.json({ 
          success: false, 
          message: 'Video file size must be less than 2MB' 
        }, { status: 400 });
      }
      // Check file type
      if (!videoFile.type.startsWith('video/')) {
        return NextResponse.json({ 
          success: false, 
          message: 'Please upload a valid video file' 
        }, { status: 400 });
      }
      
      // Delete old video if exists
      if (existingVideo) {
        const filename = existingVideo.split('/').pop();
        await deleteFileHelper(filename || '', 'videos');
      }
      videoUrl = await uploadVideoFile(videoFile);
    }
    
    // Process pest images - upload new ones to server
    const processedPests = [];
    let pestIndex = 0;
    while (formData.has(`pestName_${pestIndex}`)) {
      const pestName = formData.get(`pestName_${pestIndex}`) as string;
      const pestImageFile = formData.get(`pestImage_${pestIndex}`) as File | null;
      const existingPestImage = formData.get(`existingPestImage_${pestIndex}`) as string | null;
      
      if (pestName && pestName.trim()) {
        let imageUrl = existingPestImage || '';
        
        // If new image uploaded, delete old and upload new
        if (pestImageFile && pestImageFile.size > 0) {
          // Delete old image if exists
          if (existingPestImage) {
            const filename = existingPestImage.split('/').pop();
            await deleteFileHelper(filename || '', 'images');
          }
          imageUrl = await uploadImageFile(pestImageFile);
        }
        
        processedPests.push({
          name: pestName.trim(),
          image: imageUrl
        });
      }
      pestIndex++;
    }
    
    // Delete old pest images that are no longer in the update
    if (existingProduct.targetPestsDiseases) {
      for (const oldPest of existingProduct.targetPestsDiseases) {
        const stillExists = processedPests.some(p => p.image === oldPest.image);
        if (!stillExists && oldPest.image) {
          const filename = oldPest.image.split('/').pop();
          await deleteFileHelper(filename || '', 'images');
        }
      }
    }
    
    // Process seed data with new fields
    const processedSeeds = [];
    let seedIndex = 0;
    while (formData.has(`seedName_${seedIndex}`)) {
      const seedName = formData.get(`seedName_${seedIndex}`) as string;
      const stock = formData.get(`stock_${seedIndex}`) as string;
      const unit = formData.get(`unit_${seedIndex}`) as string;
      const customUnit = formData.get(`customUnit_${seedIndex}`) as string;
      const weight = formData.get(`weight_${seedIndex}`) as string;
      const weightUnit = formData.get(`weightUnit_${seedIndex}`) as string;
      const listPrice = formData.get(`listPrice_${seedIndex}`) as string;
      const discount = formData.get(`discount_${seedIndex}`) as string;
      const profit = formData.get(`profit_${seedIndex}`) as string;
      const tax = formData.get(`tax_${seedIndex}`) as string;
      const customTax = formData.get(`customTax_${seedIndex}`) as string;
      const finalPrice = formData.get(`finalPrice_${seedIndex}`) as string;
      const seedImageFile = formData.get(`seedImage_${seedIndex}`) as File | null;
      const existingSeedImage = formData.get(`existingSeedImage_${seedIndex}`) as string | null;
      
      if (seedName && seedName.trim()) {
        let imageUrl = existingSeedImage || '';
        
        // If new image uploaded, delete old and upload new
        if (seedImageFile && seedImageFile.size > 0) {
          // Delete old image if exists
          if (existingSeedImage) {
            const filename = existingSeedImage.split('/').pop();
            await deleteFileHelper(filename || '', 'images');
          }
          imageUrl = await uploadImageFile(seedImageFile);
        }
        
        processedSeeds.push({
          name: seedName.trim(),
          image: imageUrl,
          stock: parseInt(stock) || 0,
          unit: unit || 'kg',
          customUnit: customUnit || '',
          weight: parseFloat(weight) || 0,
          weightUnit: weightUnit || 'kg',
          listPrice: parseFloat(listPrice) || 0,
          discount: parseFloat(discount) || 0,
          profit: parseFloat(profit) || 0,
          tax: parseFloat(tax) || 18,
          customTax: customTax ? parseFloat(customTax) : undefined,
          finalPrice: parseFloat(finalPrice) || 0
        });
      }
      seedIndex++;
    }
    
    // Delete old seed images that are no longer in the update
    if (existingProduct.recommendedSeeds) {
      for (const oldSeed of existingProduct.recommendedSeeds) {
        const stillExists = processedSeeds.some(s => s.image === oldSeed.image);
        if (!stillExists && oldSeed.image) {
          const filename = oldSeed.image.split('/').pop();
          await deleteFileHelper(filename || '', 'images');
        }
      }
    }
    
    const updateData: any = {
      name: name?.trim(),
      description: description?.trim(),
      video: videoUrl,
      subCategoryId: subCategoryId,
      targetPestsDiseases: processedPests,
      recommendedSeeds: processedSeeds,
      status: status || 'active'
    };
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate({
      path: 'subCategoryId',
      select: 'name',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    });
    
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
    
    // Delete product video
    if (product.video) {
      const filename = product.video.split('/').pop();
      await deleteFileHelper(filename || '', 'videos');
    }
    
    // Delete all pest images
    if (product.targetPestsDiseases) {
      for (const pest of product.targetPestsDiseases) {
        if (pest.image) {
          const filename = pest.image.split('/').pop();
          await deleteFileHelper(filename || '', 'images');
        }
      }
    }
    
    // Delete all seed images
    if (product.recommendedSeeds) {
      for (const seed of product.recommendedSeeds) {
        if (seed.image) {
          const filename = seed.image.split('/').pop();
          await deleteFileHelper(filename || '', 'images');
        }
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
      select: 'name',
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