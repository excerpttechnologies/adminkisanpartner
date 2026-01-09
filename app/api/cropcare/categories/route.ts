

//updating this 



import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { Category } from '@/app/models/cropcare';
import { handleFileUpload, deleteFile } from '../../../lib/multer';

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
    
    // Convert FormData to a format multer can understand
    const reqClone = {
      ...request,
      file: formData.get('image') as File | null,
      body: Object.fromEntries(formData.entries())
    };
    
    let imageUrl = '';
    
    // Handle image upload if exists
    if (formData.get('image')) {
      try {
        // Create a mock request object for multer
        const mockReq = {
          file: formData.get('image')
        } as any;
        
        // Since we can't directly use multer with NextRequest,
        // we'll handle the file upload manually
        const imageFile = formData.get('image') as File;
        if (imageFile) {
          const bytes = await imageFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Generate unique filename
          const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${imageFile.name.substring(imageFile.name.lastIndexOf('.'))}`;
          const imagePath = `/uploads/cropcare/${uniqueName}`;
          
          // Save file to uploads directory
          const fs = await import('fs');
          const path = await import('path');
          
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
          imageUrl = imagePath;
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
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
    
    // Handle image upload if exists
    if (formData.get('image')) {
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        // Delete old image if exists
        if (existingImage) {
          const filename = existingImage.split('/').pop();
          await deleteFile(filename || '');
        }
        
        // Upload new image
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${imageFile.name.substring(imageFile.name.lastIndexOf('.'))}`;
        const imagePath = `/uploads/cropcare/${uniqueName}`;
        
        const fs = await import('fs');
        const path = await import('path');
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cropcare');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
        updateData.image = imagePath;
      }
    } else if (existingImage) {
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
      const filename = category.image.split('/').pop();
      await deleteFile(filename || '');
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