

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../../../lib/Db';
// import { Category } from '@/app/models/cropcare';
// import { handleFileUpload, deleteFile } from '../../../lib/multer';

// // GET all categories
// export async function GET() {
//   try {
//     await connectDB();
//     const categories = await Category.find({}).sort({ createdAt: -1 });
    
//     return NextResponse.json({ 
//       success: true, 
//       data: categories 
//     });
//   } catch (error: any) {
//     console.error('GET Categories Error:', error.message);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // CREATE category
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     // Handle FormData
//     const formData = await request.formData();
//     const name = formData.get('name') as string;
//     const status = formData.get('status') as string || 'active';
    
//     if (!name || !name.trim()) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Category name is required' 
//       }, { status: 400 });
//     }
    
//     // Convert FormData to a format multer can understand
//     const reqClone = {
//       ...request,
//       file: formData.get('image') as File | null,
//       body: Object.fromEntries(formData.entries())
//     };
    
//     let imageUrl = '';
    
//     // Handle image upload if exists
//     if (formData.get('image')) {
//       try {
//         // Create a mock request object for multer
//         const mockReq = {
//           file: formData.get('image')
//         } as any;
        
//         // Since we can't directly use multer with NextRequest,
//         // we'll handle the file upload manually
//         const imageFile = formData.get('image') as File;
//         if (imageFile) {
//           const bytes = await imageFile.arrayBuffer();
//           const buffer = Buffer.from(bytes);
          
//           // Generate unique filename
//           const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${imageFile.name.substring(imageFile.name.lastIndexOf('.'))}`;
//           const imagePath = `/uploads/cropcare/${uniqueName}`;
          
//           // Save file to uploads directory
//           const fs = await import('fs');
//           const path = await import('path');
          
//           const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare');
//           if (!fs.existsSync(uploadsDir)) {
//             fs.mkdirSync(uploadsDir, { recursive: true });
//           }
          
//           fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
//           imageUrl = imagePath;
//         }
//       } catch (uploadError) {
//         console.error('Image upload error:', uploadError);
//       }
//     }
    
//     const category = await Category.create({
//       name: name.trim(),
//       image: imageUrl,
//       status: status
//     });
    
//     console.log('CropCareCategory created successfully:', category._id);
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Category created successfully',
//       data: category 
//     }, { status: 201 });
    
//   } catch (error: any) {
//     console.error('POST Category Error:', error);
    
//     if (error.code === 11000) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Category with this name already exists' 
//       }, { status: 400 });
//     }
    
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message || 'Internal server error'
//     }, { status: 500 });
//   }
// }

// // UPDATE category
// export async function PUT(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Category ID is required' 
//       }, { status: 400 });
//     }
    
//     const formData = await request.formData();
//     const name = formData.get('name') as string;
//     const status = formData.get('status') as string;
//     const existingImage = formData.get('existingImage') as string;
    
//     const updateData: any = {
//       name: name?.trim(),
//       status: status || 'active'
//     };
    
//     // Handle image upload if exists
//     if (formData.get('image')) {
//       const imageFile = formData.get('image') as File;
//       if (imageFile && imageFile.size > 0) {
//         // Delete old image if exists
//         if (existingImage) {
//           const filename = existingImage.split('/').pop();
//           await deleteFile(filename || '');
//         }
        
//         // Upload new image
//         const bytes = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${imageFile.name.substring(imageFile.name.lastIndexOf('.'))}`;
//         const imagePath = `/uploads/cropcare/${uniqueName}`;
        
//         const fs = await import('fs');
//         const path = await import('path');
        
//         const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare');
//         if (!fs.existsSync(uploadsDir)) {
//           fs.mkdirSync(uploadsDir, { recursive: true });
//         }
        
//         fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
//         updateData.image = imagePath;
//       }
//     } else if (existingImage) {
//       updateData.image = existingImage;
//     }
    
//     const category = await Category.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );
    
//     if (!category) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Category not found' 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Category updated successfully',
//       data: category 
//     });
    
//   } catch (error: any) {
//     console.error('PUT Category Error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // DELETE category
// export async function DELETE(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Category ID is required' 
//       }, { status: 400 });
//     }
    
//     const category = await Category.findById(id);
    
//     if (!category) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Category not found' 
//       }, { status: 404 });
//     }
    
//     // Delete image file if exists
//     if (category.image) {
//       const filename = category.image.split('/').pop();
//       await deleteFile(filename || '');
//     }
    
//     await Category.findByIdAndDelete(id);
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Category deleted successfully' 
//     });
    
//   } catch (error: any) {
//     console.error('DELETE Category Error:', error);
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
//         message: 'Category ID is required' 
//       }, { status: 400 });
//     }
    
//     const body = await request.json();
    
//     if (!body.status || !['draft', 'active', 'inactive'].includes(body.status)) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Valid status is required' 
//       }, { status: 400 });
//     }
    
//     const category = await Category.findByIdAndUpdate(
//       id,
//       { status: body.status },
//       { new: true }
//     );
    
//     if (!category) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Category not found' 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Category status updated successfully',
//       data: category 
//     });
    
//   } catch (error: any) {
//     console.error('PATCH Category Error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }


















import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { Category } from '@/app/models/cropcare';

// Helper functions for file handling
import fs from 'fs';
import path from 'path';

// Define uploads directory (outside public folder)
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
const CROPCARE_UPLOADS_DIR = path.join(UPLOADS_BASE_DIR, 'cropcare');

/**
 * Ensure uploads directory exists
 */
function ensureUploadsDirectory(): string {
  try {
    // Create base uploads directory if it doesn't exist
    if (!fs.existsSync(UPLOADS_BASE_DIR)) {
      fs.mkdirSync(UPLOADS_BASE_DIR, { recursive: true });
      console.log('Base uploads directory created:', UPLOADS_BASE_DIR);
    }
    
    // Create cropcare subdirectory if it doesn't exist
    if (!fs.existsSync(CROPCARE_UPLOADS_DIR)) {
      fs.mkdirSync(CROPCARE_UPLOADS_DIR, { recursive: true });
      console.log('CropCare uploads directory created:', CROPCARE_UPLOADS_DIR);
    }
    
    return CROPCARE_UPLOADS_DIR;
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    throw error;
  }
}

/**
 * Save file to uploads directory
 */
async function saveFileToUploads(file: File): Promise<string> {
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
    const filePath = path.join(CROPCARE_UPLOADS_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);
    
    // Return the URL path that will be used to access the file
    return `/api/uploads/cropcare/${uniqueName}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

/**
 * Delete file from uploads directory
 */
async function deleteFileFromUploads(imageUrl: string): Promise<boolean> {
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    if (!filename) {
      return false;
    }
    
    const filePath = path.join(CROPCARE_UPLOADS_DIR, filename);
    
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

// GET all categories
export async function GET() {
  try {
    await connectDB();
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
    
    // Handle FormData
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const status = formData.get('status') as string || 'active';
    
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category name is required' 
      }, { status: 400 });
    }
    
    let imageUrl = '';
    
    // Handle image upload if exists
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      try {
        // Save file using our helper function
        imageUrl = await saveFileToUploads(imageFile);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to upload image'
        }, { status: 500 });
      }
    }
    
    const category = await Category.create({
      name: name.trim(),
      image: imageUrl,
      status: status
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
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const status = formData.get('status') as string;
    const existingImage = formData.get('existingImage') as string;
    
    const updateData: any = {
      name: name?.trim(),
      status: status || 'active'
    };
    
    // Handle image upload if new image provided
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingImage) {
        await deleteFileFromUploads(existingImage);
      }
      
      // Save new image
      try {
        updateData.image = await saveFileToUploads(imageFile);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to upload new image'
        }, { status: 500 });
      }
    } else if (existingImage) {
      // Keep existing image
      updateData.image = existingImage;
    }
    
    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
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
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found' 
      }, { status: 404 });
    }
    
    // Delete image file if exists
    if (category.image) {
      await deleteFileFromUploads(category.image);
    }
    
    await Category.findByIdAndDelete(id);
    
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
    
    const category = await Category.findByIdAndUpdate(
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