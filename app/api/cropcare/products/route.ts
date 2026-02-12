

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../../../lib/Db';
// import { Product, SubCategory } from '@/app/models/cropcare';
// import { deleteFile } from '../../../lib/multer';

// // Helper function to upload image file
// async function uploadImageFile(imageFile: File): Promise<string> {
//   const bytes = await imageFile.arrayBuffer();
//   const buffer = Buffer.from(bytes);
//   const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${imageFile.name.substring(imageFile.name.lastIndexOf('.'))}`;
//   const imagePath = `/uploads/cropcare/images/${uniqueName}`;
  
//   const fs = await import('fs');
//   const path = await import('path');
  
//   const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare', 'images');
//   if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
//   }
  
//   fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
//   return imagePath;
// }

// // Helper function to upload video file
// async function uploadVideoFile(videoFile: File): Promise<string> {
//   const bytes = await videoFile.arrayBuffer();
//   const buffer = Buffer.from(bytes);
//   const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${videoFile.name.substring(videoFile.name.lastIndexOf('.'))}`;
//   const videoPath = `/uploads/cropcare/videos/${uniqueName}`;
  
//   const fs = await import('fs');
//   const path = await import('path');
  
//   const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare', 'videos');
//   if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
//   }
  
//   fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
//   return videoPath;
// }

// // Updated deleteFile helper to handle both images and videos
// async function deleteFileHelper(filename: string, type: 'images' | 'videos' = 'images') {
//   const fs = await import('fs');
//   const path = await import('path');
  
//   const filePath = path.join(process.cwd(), 'public', 'uploads', 'cropcare', type, filename);
  
//   if (fs.existsSync(filePath)) {
//     fs.unlinkSync(filePath);
//   }
// }

// // GET all products
// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find({})
//       .populate({
//         path: 'subCategoryId',
//         select: 'name',
//         populate: {
//           path: 'categoryId',
//           select: 'name'
//         }
//       })
//       .sort({ createdAt: -1 });
    
//     return NextResponse.json({ 
//       success: true, 
//       data: products 
//     });
//   } catch (error: any) {
//     console.error('GET Products Error:', error.message);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // CREATE product
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const formData = await request.formData();
//     const name = formData.get('name') as string;
//     const description = formData.get('description') as string || '';
//     const subCategoryId = formData.get('subCategoryId') as string;
//     const status = formData.get('status') as string || 'active';
    
//     if (!name || !name.trim()) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Product name is required' 
//       }, { status: 400 });
//     }
    
//     if (!subCategoryId) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'SubCategory ID is required' 
//       }, { status: 400 });
//     }
    
//     // Check if subcategory exists
//     const subCategoryExists = await SubCategory.findById(subCategoryId);
//     if (!subCategoryExists) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'SubCategory not found' 
//       }, { status: 404 });
//     }
    
//     // Process video upload
//     const videoFile = formData.get('video') as File | null;
//     let videoUrl = '';
//     if (videoFile && videoFile.size > 0) {
//       // Check file size (2MB limit)
//       if (videoFile.size > 2 * 1024 * 1024) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Video file size must be less than 2MB' 
//         }, { status: 400 });
//       }
//       // Check file type
//       if (!videoFile.type.startsWith('video/')) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Please upload a valid video file' 
//         }, { status: 400 });
//       }
//       videoUrl = await uploadVideoFile(videoFile);
//     }
    
//     // Process pest images - upload to server
//     const processedPests = [];
//     let pestIndex = 0;
//     while (formData.has(`pestName_${pestIndex}`)) {
//       const pestName = formData.get(`pestName_${pestIndex}`) as string;
//       const pestImageFile = formData.get(`pestImage_${pestIndex}`) as File | null;
      
//       if (pestName && pestName.trim()) {
//         let imageUrl = '';
//         if (pestImageFile && pestImageFile.size > 0) {
//           imageUrl = await uploadImageFile(pestImageFile);
//         }
        
//         processedPests.push({
//           name: pestName.trim(),
//           image: imageUrl
//         });
//       }
//       pestIndex++;
//     }
    
//     // Process seed data with new fields
//     const processedSeeds = [];
//     let seedIndex = 0;
//     while (formData.has(`seedName_${seedIndex}`)) {
//       const seedName = formData.get(`seedName_${seedIndex}`) as string;
//       const stock = formData.get(`stock_${seedIndex}`) as string;
//       const unit = formData.get(`unit_${seedIndex}`) as string;
//       const customUnit = formData.get(`customUnit_${seedIndex}`) as string;
//       const weight = formData.get(`weight_${seedIndex}`) as string;
//       const weightUnit = formData.get(`weightUnit_${seedIndex}`) as string;
//       const listPrice = formData.get(`listPrice_${seedIndex}`) as string;
//       const discount = formData.get(`discount_${seedIndex}`) as string;
//       const profit = formData.get(`profit_${seedIndex}`) as string;
//       const tax = formData.get(`tax_${seedIndex}`) as string;
//       const customTax = formData.get(`customTax_${seedIndex}`) as string;
//       const finalPrice = formData.get(`finalPrice_${seedIndex}`) as string;
//       const seedImageFile = formData.get(`seedImage_${seedIndex}`) as File | null;
      
//       if (seedName && seedName.trim()) {
//         let imageUrl = '';
//         if (seedImageFile && seedImageFile.size > 0) {
//           imageUrl = await uploadImageFile(seedImageFile);
//         }
        
//         processedSeeds.push({
//           name: seedName.trim(),
//           image: imageUrl,
//           stock: parseInt(stock) || 0,
//           unit: unit || 'kg',
//           customUnit: customUnit || '',
//           weight: parseFloat(weight) || 0,
//           weightUnit: weightUnit || 'kg',
//           listPrice: parseFloat(listPrice) || 0,
//           discount: parseFloat(discount) || 0,
//           profit: parseFloat(profit) || 0,
//           tax: parseFloat(tax) || 18,
//           customTax: customTax ? parseFloat(customTax) : undefined,
//           finalPrice: parseFloat(finalPrice) || 0
//         });
//       }
//       seedIndex++;
//     }
    
//     const product = await Product.create({
//       name: name.trim(),
//       description: description.trim(),
//       video: videoUrl,
//       subCategoryId: subCategoryId,
//       targetPestsDiseases: processedPests,
//       recommendedSeeds: processedSeeds,
//       status: status
//     });
    
//     console.log('Product created successfully:', product._id);
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Product created successfully',
//       data: product 
//     }, { status: 201 });
    
//   } catch (error: any) {
//     console.error('POST Product Error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message || 'Internal server error'
//     }, { status: 500 });
//   }
// }

// // UPDATE product
// export async function PUT(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Product ID is required' 
//       }, { status: 400 });
//     }
    
//     const formData = await request.formData();
//     const name = formData.get('name') as string;
//     const description = formData.get('description') as string || '';
//     const subCategoryId = formData.get('subCategoryId') as string;
//     const status = formData.get('status') as string;
    
//     // Get existing product to delete old files if needed
//     const existingProduct = await Product.findById(id);
//     if (!existingProduct) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Product not found' 
//       }, { status: 404 });
//     }
    
//     // Process video upload
//     const videoFile = formData.get('video') as File | null;
//     const existingVideo = formData.get('existingVideo') as string | null;
//     let videoUrl = existingVideo || '';
    
//     if (videoFile && videoFile.size > 0) {
//       // Check file size (2MB limit)
//       if (videoFile.size > 2 * 1024 * 1024) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Video file size must be less than 2MB' 
//         }, { status: 400 });
//       }
//       // Check file type
//       if (!videoFile.type.startsWith('video/')) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Please upload a valid video file' 
//         }, { status: 400 });
//       }
      
//       // Delete old video if exists
//       if (existingVideo) {
//         const filename = existingVideo.split('/').pop();
//         await deleteFileHelper(filename || '', 'videos');
//       }
//       videoUrl = await uploadVideoFile(videoFile);
//     }
    
//     // Process pest images - upload new ones to server
//     const processedPests = [];
//     let pestIndex = 0;
//     while (formData.has(`pestName_${pestIndex}`)) {
//       const pestName = formData.get(`pestName_${pestIndex}`) as string;
//       const pestImageFile = formData.get(`pestImage_${pestIndex}`) as File | null;
//       const existingPestImage = formData.get(`existingPestImage_${pestIndex}`) as string | null;
      
//       if (pestName && pestName.trim()) {
//         let imageUrl = existingPestImage || '';
        
//         // If new image uploaded, delete old and upload new
//         if (pestImageFile && pestImageFile.size > 0) {
//           // Delete old image if exists
//           if (existingPestImage) {
//             const filename = existingPestImage.split('/').pop();
//             await deleteFileHelper(filename || '', 'images');
//           }
//           imageUrl = await uploadImageFile(pestImageFile);
//         }
        
//         processedPests.push({
//           name: pestName.trim(),
//           image: imageUrl
//         });
//       }
//       pestIndex++;
//     }
    
//     // Delete old pest images that are no longer in the update
//     if (existingProduct.targetPestsDiseases) {
//       for (const oldPest of existingProduct.targetPestsDiseases) {
//         const stillExists = processedPests.some(p => p.image === oldPest.image);
//         if (!stillExists && oldPest.image) {
//           const filename = oldPest.image.split('/').pop();
//           await deleteFileHelper(filename || '', 'images');
//         }
//       }
//     }
    
//     // Process seed data with new fields
//     const processedSeeds = [];
//     let seedIndex = 0;
//     while (formData.has(`seedName_${seedIndex}`)) {
//       const seedName = formData.get(`seedName_${seedIndex}`) as string;
//       const stock = formData.get(`stock_${seedIndex}`) as string;
//       const unit = formData.get(`unit_${seedIndex}`) as string;
//       const customUnit = formData.get(`customUnit_${seedIndex}`) as string;
//       const weight = formData.get(`weight_${seedIndex}`) as string;
//       const weightUnit = formData.get(`weightUnit_${seedIndex}`) as string;
//       const listPrice = formData.get(`listPrice_${seedIndex}`) as string;
//       const discount = formData.get(`discount_${seedIndex}`) as string;
//       const profit = formData.get(`profit_${seedIndex}`) as string;
//       const tax = formData.get(`tax_${seedIndex}`) as string;
//       const customTax = formData.get(`customTax_${seedIndex}`) as string;
//       const finalPrice = formData.get(`finalPrice_${seedIndex}`) as string;
//       const seedImageFile = formData.get(`seedImage_${seedIndex}`) as File | null;
//       const existingSeedImage = formData.get(`existingSeedImage_${seedIndex}`) as string | null;
      
//       if (seedName && seedName.trim()) {
//         let imageUrl = existingSeedImage || '';
        
//         // If new image uploaded, delete old and upload new
//         if (seedImageFile && seedImageFile.size > 0) {
//           // Delete old image if exists
//           if (existingSeedImage) {
//             const filename = existingSeedImage.split('/').pop();
//             await deleteFileHelper(filename || '', 'images');
//           }
//           imageUrl = await uploadImageFile(seedImageFile);
//         }
        
//         processedSeeds.push({
//           name: seedName.trim(),
//           image: imageUrl,
//           stock: parseInt(stock) || 0,
//           unit: unit || 'kg',
//           customUnit: customUnit || '',
//           weight: parseFloat(weight) || 0,
//           weightUnit: weightUnit || 'kg',
//           listPrice: parseFloat(listPrice) || 0,
//           discount: parseFloat(discount) || 0,
//           profit: parseFloat(profit) || 0,
//           tax: parseFloat(tax) || 18,
//           customTax: customTax ? parseFloat(customTax) : undefined,
//           finalPrice: parseFloat(finalPrice) || 0
//         });
//       }
//       seedIndex++;
//     }
    
//     // Delete old seed images that are no longer in the update
//     if (existingProduct.recommendedSeeds) {
//       for (const oldSeed of existingProduct.recommendedSeeds) {
//         const stillExists = processedSeeds.some(s => s.image === oldSeed.image);
//         if (!stillExists && oldSeed.image) {
//           const filename = oldSeed.image.split('/').pop();
//           await deleteFileHelper(filename || '', 'images');
//         }
//       }
//     }
    
//     const updateData: any = {
//       name: name?.trim(),
//       description: description?.trim(),
//       video: videoUrl,
//       subCategoryId: subCategoryId,
//       targetPestsDiseases: processedPests,
//       recommendedSeeds: processedSeeds,
//       status: status || 'active'
//     };
    
//     const product = await Product.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     ).populate({
//       path: 'subCategoryId',
//       select: 'name',
//       populate: {
//         path: 'categoryId',
//         select: 'name'
//       }
//     });
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Product updated successfully',
//       data: product 
//     });
    
//   } catch (error: any) {
//     console.error('PUT Product Error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // DELETE product
// export async function DELETE(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Product ID is required' 
//       }, { status: 400 });
//     }
    
//     const product = await Product.findById(id);
    
//     if (!product) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Product not found' 
//       }, { status: 404 });
//     }
    
//     // Delete product video
//     if (product.video) {
//       const filename = product.video.split('/').pop();
//       await deleteFileHelper(filename || '', 'videos');
//     }
    
//     // Delete all pest images
//     if (product.targetPestsDiseases) {
//       for (const pest of product.targetPestsDiseases) {
//         if (pest.image) {
//           const filename = pest.image.split('/').pop();
//           await deleteFileHelper(filename || '', 'images');
//         }
//       }
//     }
    
//     // Delete all seed images
//     if (product.recommendedSeeds) {
//       for (const seed of product.recommendedSeeds) {
//         if (seed.image) {
//           const filename = seed.image.split('/').pop();
//           await deleteFileHelper(filename || '', 'images');
//         }
//       }
//     }
    
//     await Product.findByIdAndDelete(id);
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Product deleted successfully' 
//     });
    
//   } catch (error: any) {
//     console.error('DELETE Product Error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // PATCH - Update status
// export async function PATCH(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Product ID is required' 
//       }, { status: 400 });
//     }
    
//     const body = await request.json();
    
//     if (!body.status || !['draft', 'active', 'inactive'].includes(body.status)) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Valid status is required' 
//       }, { status: 400 });
//     }
    
//     const product = await Product.findByIdAndUpdate(
//       id,
//       { status: body.status },
//       { new: true }
//     ).populate({
//       path: 'subCategoryId',
//       select: 'name',
//       populate: {
//         path: 'categoryId',
//         select: 'name'
//       }
//     });
    
//     if (!product) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Product not found' 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Product status updated successfully',
//       data: product 
//     });
    
//   } catch (error: any) {
//     console.error('PATCH Product Error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }













import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { Product, SubCategory } from '@/app/models/cropcare';

// Helper functions for file handling
import fs from 'fs';
import path from 'path';

// Define uploads directory (outside public folder)
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
const CROPCARE_UPLOADS_DIR = path.join(UPLOADS_BASE_DIR, 'cropcare');
const IMAGES_UPLOADS_DIR = path.join(CROPCARE_UPLOADS_DIR, 'images');
const VIDEOS_UPLOADS_DIR = path.join(CROPCARE_UPLOADS_DIR, 'videos');

/**
 * Ensure uploads directory exists
 */
function ensureUploadsDirectory(): void {
  try {
    // Create base uploads directory if it doesn't exist
    if (!fs.existsSync(UPLOADS_BASE_DIR)) {
      fs.mkdirSync(UPLOADS_BASE_DIR, { recursive: true });
    }
    
    // Create cropcare subdirectory if it doesn't exist
    if (!fs.existsSync(CROPCARE_UPLOADS_DIR)) {
      fs.mkdirSync(CROPCARE_UPLOADS_DIR, { recursive: true });
    }
    
    // Create images subdirectory if it doesn't exist
    if (!fs.existsSync(IMAGES_UPLOADS_DIR)) {
      fs.mkdirSync(IMAGES_UPLOADS_DIR, { recursive: true });
    }
    
    // Create videos subdirectory if it doesn't exist
    if (!fs.existsSync(VIDEOS_UPLOADS_DIR)) {
      fs.mkdirSync(VIDEOS_UPLOADS_DIR, { recursive: true });
    }
    
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    throw error;
  }
}

/**
 * Save image file to uploads directory
 */
async function saveImageFile(file: File): Promise<string> {
  try {
    // Ensure directory exists
    ensureUploadsDirectory();
    
    // Generate unique filename
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || '';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file
    const filePath = path.join(IMAGES_UPLOADS_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);
    
    // Return the URL path that will be used to access the file
    return `/api/uploads/cropcare/images/${uniqueName}`;
  } catch (error) {
    console.error('Error saving image file:', error);
    throw error;
  }
}

/**
 * Save video file to uploads directory
 */
async function saveVideoFile(file: File): Promise<string> {
  try {
    // Ensure directory exists
    ensureUploadsDirectory();
    
    // Generate unique filename
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || '';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file
    const filePath = path.join(VIDEOS_UPLOADS_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);
    
    // Return the URL path that will be used to access the file
    return `/api/uploads/cropcare/videos/${uniqueName}`;
  } catch (error) {
    console.error('Error saving video file:', error);
    throw error;
  }
}

/**
 * Delete file from uploads directory
 */
async function deleteFileFromUploads(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl) return false;
    
    // Determine the file type and extract filename
    let filename = '';
    let filePath = '';
    
    if (fileUrl.includes('/api/uploads/cropcare/images/')) {
      filename = fileUrl.split('/api/uploads/cropcare/images/')[1];
      filePath = path.join(IMAGES_UPLOADS_DIR, filename);
    } else if (fileUrl.includes('/api/uploads/cropcare/videos/')) {
      filename = fileUrl.split('/api/uploads/cropcare/videos/')[1];
      filePath = path.join(VIDEOS_UPLOADS_DIR, filename);
    } else if (fileUrl.includes('/uploads/cropcare/images/')) {
      filename = fileUrl.split('/uploads/cropcare/images/')[1];
      filePath = path.join(IMAGES_UPLOADS_DIR, filename);
    } else if (fileUrl.includes('/uploads/cropcare/videos/')) {
      filename = fileUrl.split('/uploads/cropcare/videos/')[1];
      filePath = path.join(VIDEOS_UPLOADS_DIR, filename);
    } else {
      // For backward compatibility
      const parts = fileUrl.split('/');
      filename = parts[parts.length - 1];
      if (fileUrl.includes('videos')) {
        filePath = path.join(VIDEOS_UPLOADS_DIR, filename);
      } else {
        filePath = path.join(IMAGES_UPLOADS_DIR, filename);
      }
    }
    
    if (!filename) return false;
    
    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

// Initialize uploads directory on import
ensureUploadsDirectory();

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
      
      try {
        videoUrl = await saveVideoFile(videoFile);
      } catch (uploadError) {
        console.error('Video upload error:', uploadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to upload video'
        }, { status: 500 });
      }
    }
    
    // Process pest images
    const processedPests = [];
    let pestIndex = 0;
    while (formData.has(`pestName_${pestIndex}`)) {
      const pestName = formData.get(`pestName_${pestIndex}`) as string;
      const pestImageFile = formData.get(`pestImage_${pestIndex}`) as File | null;
      
      if (pestName && pestName.trim()) {
        let imageUrl = '';
        if (pestImageFile && pestImageFile.size > 0) {
          try {
            imageUrl = await saveImageFile(pestImageFile);
          } catch (uploadError) {
            console.error('Pest image upload error:', uploadError);
          }
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
          try {
            imageUrl = await saveImageFile(seedImageFile);
          } catch (uploadError) {
            console.error('Seed image upload error:', uploadError);
          }
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
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product with this name already exists' 
      }, { status: 400 });
    }
    
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
        await deleteFileFromUploads(existingVideo);
      }
      
      try {
        videoUrl = await saveVideoFile(videoFile);
      } catch (uploadError) {
        console.error('Video upload error:', uploadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to upload new video'
        }, { status: 500 });
      }
    }
    
    // Process pest images
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
            await deleteFileFromUploads(existingPestImage);
          }
          
          try {
            imageUrl = await saveImageFile(pestImageFile);
          } catch (uploadError) {
            console.error('Pest image upload error:', uploadError);
          }
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
          await deleteFileFromUploads(oldPest.image);
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
            await deleteFileFromUploads(existingSeedImage);
          }
          
          try {
            imageUrl = await saveImageFile(seedImageFile);
          } catch (uploadError) {
            console.error('Seed image upload error:', uploadError);
          }
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
          await deleteFileFromUploads(oldSeed.image);
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
      { new: true, runValidators: true }
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
        message: 'Product not found after update' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: product 
    });
    
  } catch (error: any) {
    console.error('PUT Product Error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product with this name already exists' 
      }, { status: 400 });
    }
    
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
      await deleteFileFromUploads(product.video);
    }
    
    // Delete all pest images
    if (product.targetPestsDiseases) {
      for (const pest of product.targetPestsDiseases) {
        if (pest.image) {
          await deleteFileFromUploads(pest.image);
        }
      }
    }
    
    // Delete all seed images
    if (product.recommendedSeeds) {
      for (const seed of product.recommendedSeeds) {
        if (seed.image) {
          await deleteFileFromUploads(seed.image);
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