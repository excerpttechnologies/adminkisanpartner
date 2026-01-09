

//updating ths 


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import { SubCategory, Category } from '@/app/models/cropcare';
import { deleteFile } from '../../../lib/multer';

// GET all subcategories
export async function GET() {
  try {
    await connectDB();
    const subcategories = await SubCategory.find({})
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
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const status = formData.get('status') as string || 'active';
    
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory name is required' 
      }, { status: 400 });
    }
    
    if (!categoryId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category ID is required' 
      }, { status: 400 });
    }
    
    // Check if category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'Parent category not found' 
      }, { status: 404 });
    }
    
    let imageUrl = '';
    
    // Handle image upload if exists
    if (formData.get('image')) {
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
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
        imageUrl = imagePath;
      }
    }
    
    const subcategory = await SubCategory.create({
      name: name.trim(),
      image: imageUrl,
      categoryId: categoryId,
      status: status
    });
    
    console.log('SubCategory created successfully:', subcategory._id);
    
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
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const status = formData.get('status') as string;
    const existingImage = formData.get('existingImage') as string;
    
    const updateData: any = {
      name: name?.trim(),
      categoryId: categoryId,
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
    
    const subcategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
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
    
    const subcategory = await SubCategory.findById(id);
    
    if (!subcategory) {
      return NextResponse.json({ 
        success: false, 
        message: 'SubCategory not found' 
      }, { status: 404 });
    }
    
    // Delete image file if exists
    if (subcategory.image) {
      const filename = subcategory.image.split('/').pop();
      await deleteFile(filename || '');
    }
    
    await SubCategory.findByIdAndDelete(id);
    
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
    
    const subcategory = await SubCategory.findByIdAndUpdate(
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