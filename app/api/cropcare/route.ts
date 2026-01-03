




// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../../lib/Db';
// import { Category, SubCategory, Product } from "../../models/cropcare";
// import { writeFile, mkdir } from 'fs/promises';
// import { join } from 'path';
// import { existsSync } from 'fs';

// // Helper function to save image to server
// async function saveImage(base64Data: string, filename: string): Promise<string> {
//   try {
//     // Remove data URL prefix if present
//     const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
//     const buffer = Buffer.from(base64Image, 'base64');
    
//     // Create uploads directory if it doesn't exist
//     const uploadDir = join(process.cwd(), 'public', 'uploads');
//     if (!existsSync(uploadDir)) {
//       await mkdir(uploadDir, { recursive: true });
//     }
    
//     // Save file
//     const filepath = join(uploadDir, filename);
//     await writeFile(filepath, buffer);
    
//     // Return relative URL
//     return `/uploads/${filename}`;
//   } catch (error) {
//     console.error('Error saving image:', error);
//     throw error;
//   }
// }

// // Helper function to generate unique filename
// function generateFilename(originalName: string): string {
//   const timestamp = Date.now();
//   const randomString = Math.random().toString(36).substring(2, 15);
//   const extension = originalName.split('.').pop() || 'jpg';
//   return `image_${timestamp}_${randomString}.${extension}`;
// }

// // Handle GET requests
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const type = searchParams.get('type');
    
//     if (type === 'categories') {
//       const categories = await Category.find({}).sort({ createdAt: -1 });
//       return NextResponse.json({ success: true, data: categories });
//     }
    
//     if (type === 'subcategories') {
//       const subcategories = await SubCategory.find({})
//         .populate('categoryId', 'name')
//         .sort({ createdAt: -1 });
//       return NextResponse.json({ success: true, data: subcategories });
//     }
    
//     if (type === 'products') {
//       const products = await Product.find({})
//         .populate({
//           path: 'subCategoryId',
//           select: 'name categoryId',
//           populate: {
//             path: 'categoryId',
//             select: 'name'
//           }
//         })
//         .sort({ createdAt: -1 });
//       return NextResponse.json({ success: true, data: products });
//     }
    
//     if (type === 'summary') {
//       const [categories, subcategories, products] = await Promise.all([
//         Category.countDocuments(),
//         SubCategory.countDocuments(),
//         Product.countDocuments()
//       ]);
      
//       return NextResponse.json({
//         success: true,
//         data: {
//           categories,
//           subCategories: subcategories,
//           products
//         }
//       });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'CropCare API is running' 
//     });
    
//   } 
//   catch (error: any) {
//     console.error('API :', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // Handle POST requests (Create)
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const formData = await request.formData();
//     const type = formData.get('type') as string;
    
//     if (type === 'category') {
//       const name = formData.get('name') as string;
//       const imageFile = formData.get('image') as File | null;
//       const status = (formData.get('status') as string) || 'active';
      
//       let imageUrl = '';
//       if (imageFile) {
//         // Convert file to base64
//         const bytes = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64Image = buffer.toString('base64');
//         const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
//         // Save to server
//         const filename = generateFilename(imageFile.name || 'category.jpg');
//         imageUrl = await saveImage(dataUrl, filename);
//       }
      
//       const category = await Category.create({
//         name,
//         image: imageUrl,
//         status
//       });
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Category created successfully',
//         data: category 
//       });
//     }
    
//     if (type === 'subcategory') {
//       const name = formData.get('name') as string;
//       const categoryId = formData.get('categoryId') as string;
//       const imageFile = formData.get('image') as File | null;
//       const status = (formData.get('status') as string) || 'active';
      
//       let imageUrl = '';
//       if (imageFile) {
//         const bytes = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64Image = buffer.toString('base64');
//         const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
//         const filename = generateFilename(imageFile.name || 'subcategory.jpg');
//         imageUrl = await saveImage(dataUrl, filename);
//       }
      
//       const subcategory = await SubCategory.create({
//         name,
//         categoryId,
//         image: imageUrl,
//         status
//       });
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Subcategory created successfully',
//         data: subcategory 
//       });
//     }
    
//     if (type === 'product') {
//       const name = formData.get('name') as string;
//       const subCategoryId = formData.get('subCategoryId') as string;
//       const targetPestsDiseases = JSON.parse(formData.get('targetPestsDiseases') as string);
//       const recommendedSeeds = JSON.parse(formData.get('recommendedSeeds') as string);
//       const status = (formData.get('status') as string) || 'active';
      
//       const product = await Product.create({
//         name,
//         subCategoryId,
//         targetPestsDiseases,
//         recommendedSeeds,
//         status
//       });
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Product created successfully',
//         data: product 
//       });
//     }
    
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Invalid type specified' 
//     }, { status: 400 });
    
//   } catch (error: any) {
//     console.error('Error in POST:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // Handle PUT requests (Update)
// export async function PUT(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     const type = searchParams.get('type') as string;
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'ID is required' 
//       }, { status: 400 });
//     }
    
//     const formData = await request.formData();
    
//     if (type === 'category') {
//       const name = formData.get('name') as string;
//       const imageFile = formData.get('image') as File | null;
//       const status = formData.get('status') as string;
      
//       const updateData: any = { name, status };
      
//       if (imageFile) {
//         const bytes = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64Image = buffer.toString('base64');
//         const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
//         const filename = generateFilename(imageFile.name || 'category.jpg');
//         const imageUrl = await saveImage(dataUrl, filename);
//         updateData.image = imageUrl;
//       } else if (formData.get('image') === '') {
//         updateData.image = '';
//       }
      
//       const category = await Category.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true }
//       );
      
//       if (!category) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Category not found' 
//         }, { status: 404 });
//       }
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Category updated successfully',
//         data: category 
//       });
//     }
    
//     if (type === 'subcategory') {
//       const name = formData.get('name') as string;
//       const categoryId = formData.get('categoryId') as string;
//       const imageFile = formData.get('image') as File | null;
//       const status = formData.get('status') as string;
      
//       const updateData: any = { name, categoryId, status };
      
//       if (imageFile) {
//         const bytes = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64Image = buffer.toString('base64');
//         const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
//         const filename = generateFilename(imageFile.name || 'subcategory.jpg');
//         const imageUrl = await saveImage(dataUrl, filename);
//         updateData.image = imageUrl;
//       } else if (formData.get('image') === '') {
//         updateData.image = '';
//       }
      
//       const subcategory = await SubCategory.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true }
//       );
      
//       if (!subcategory) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Subcategory not found' 
//         }, { status: 404 });
//       }
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Subcategory updated successfully',
//         data: subcategory 
//       });
//     }
    
//     if (type === 'product') {
//       const updateData = await request.json();
//       const product = await Product.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true }
//       );
      
//       if (!product) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Product not found' 
//         }, { status: 404 });
//       }
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Product updated successfully',
//         data: product 
//       });
//     }
    
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Invalid type specified' 
//     }, { status: 400 });
    
//   } catch (error: any) {
//     console.error('Error in PUT:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // Handle PATCH requests (Partial Update - Status Change)
// export async function PATCH(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     const type = searchParams.get('type') as string;
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'ID is required' 
//       }, { status: 400 });
//     }
    
//     const body = await request.json();
//     const { status } = body;
    
//     let Model;
//     if (type === 'category') Model = Category;
//     else if (type === 'subcategory') Model = SubCategory;
//     else if (type === 'product') Model = Product;
//     else {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Invalid type specified' 
//       }, { status: 400 });
//     }
    
//     const updatedDoc = await Model.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );
    
//     if (!updatedDoc) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Document not found' 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Status updated successfully',
//       data: updatedDoc 
//     });
    
//   } catch (error: any) {
//     console.error('Error in PATCH:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // Handle DELETE requests
// export async function DELETE(request: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     const type = searchParams.get('type') as string;
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'ID is required' 
//       }, { status: 400 });
//     }
    
//     let Model;
//     if (type === 'category') Model = Category;
//     else if (type === 'subcategory') Model = SubCategory;
//     else if (type === 'product') Model = Product;
//     else {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Invalid type specified' 
//       }, { status: 400 });
//     }
    
//     const deletedDoc = await Model.findByIdAndDelete(id);
    
//     if (!deletedDoc) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Document not found' 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: 'Document deleted successfully' 
//     });
    
//   } catch (error: any) {
//     console.error('Error in DELETE:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/Db';
import { Category, SubCategory, Product } from "../../models/cropcare";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Helper function to save image to server
async function saveImage(base64Data: string, filename: string): Promise<string> {
  try {
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');
    
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

// Helper function to generate unique filename
function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'jpg';
  return `image_${timestamp}_${randomString}.${extension}`;
}

// Handle GET requests
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'categories') {
      const categories = await Category.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: categories });
    }
    
    if (type === 'subcategories') {
      const subcategories = await SubCategory.find({})
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: subcategories });
    }
    
    if (type === 'products') {
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
      return NextResponse.json({ success: true, data: products });
    }
    
    if (type === 'summary') {
      const [categories, subcategories, products] = await Promise.all([
        Category.countDocuments(),
        SubCategory.countDocuments(),
        Product.countDocuments()
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          categories,
          subCategories: subcategories,
          products
        }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'CropCare API is running' 
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Handle POST requests (Create)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();
    const type = formData.get('type') as string;
    
    if (type === 'category') {
      const name = formData.get('name') as string;
      const imageFile = formData.get('image') as File | null;
      const status = (formData.get('status') as string) || 'active';
      
      let imageUrl = '';
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
        const filename = generateFilename(imageFile.name || 'category.jpg');
        imageUrl = await saveImage(dataUrl, filename);
      }
      
      const category = await Category.create({
        name,
        image: imageUrl,
        status
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Category created successfully',
        data: category 
      });
    }
    
    if (type === 'subcategory') {
      const name = formData.get('name') as string;
      const categoryId = formData.get('categoryId') as string;
      const imageFile = formData.get('image') as File | null;
      const status = (formData.get('status') as string) || 'active';
      
      let imageUrl = '';
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
        const filename = generateFilename(imageFile.name || 'subcategory.jpg');
        imageUrl = await saveImage(dataUrl, filename);
      }
      
      const subcategory = await SubCategory.create({
        name,
        categoryId,
        image: imageUrl,
        status
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Subcategory created successfully',
        data: subcategory 
      });
    }
    
    if (type === 'product') {
      const name = formData.get('name') as string;
      const subCategoryId = formData.get('subCategoryId') as string;
      const targetPestsDiseases = JSON.parse(formData.get('targetPestsDiseases') as string || '[]');
      const recommendedSeeds = JSON.parse(formData.get('recommendedSeeds') as string || '[]');
      const status = (formData.get('status') as string) || 'active';
      
      const product = await Product.create({
        name,
        subCategoryId,
        targetPestsDiseases,
        recommendedSeeds,
        status
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Product created successfully',
        data: product 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid type specified' 
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error in POST:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

// Handle PUT requests (Update)
// export async function PUT(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     const type = searchParams.get('type') as string;
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'ID is required' 
//       }, { status: 400 });
//     }
    
//     if (type === 'product') {
//       // Parse form data for product update
//       const formData = await request.formData();
      
//       const name = formData.get('name') as string;
//       const subCategoryId = formData.get('subCategoryId') as string;
//       const targetPestsDiseases = JSON.parse(formData.get('targetPestsDiseases') as string || '[]');
//       const recommendedSeeds = JSON.parse(formData.get('recommendedSeeds') as string || '[]');
//       const status = (formData.get('status') as string) || 'active';
      
//       const updateData = {
//         name,
//         subCategoryId,
//         targetPestsDiseases,
//         recommendedSeeds,
//         status
//       };
      
//       const product = await Product.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true }
//       ).populate({
//         path: 'subCategoryId',
//         select: 'name categoryId',
//         populate: {
//           path: 'categoryId',
//           select: 'name'
//         }
//       });
      
//       if (!product) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Product not found' 
//         }, { status: 404 });
//       }
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Product updated successfully',
//         data: product 
//       });
//     }
    
//     // Handle category update
//     if (type === 'category') {
//       const formData = await request.formData();
//       const name = formData.get('name') as string;
//       const imageFile = formData.get('image') as File | null;
//       const status = formData.get('status') as string;
      
//       const updateData: any = { name, status };
      
//       if (imageFile && imageFile instanceof File && imageFile.size > 0) {
//         const bytes = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64Image = buffer.toString('base64');
//         const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
//         const filename = generateFilename(imageFile.name || 'category.jpg');
//         const imageUrl = await saveImage(dataUrl, filename);
//         updateData.image = imageUrl;
//       } else if (formData.get('image') === '') {
//         updateData.image = '';
//       }
      
//       const category = await Category.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true }
//       );
      
//       if (!category) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Category not found' 
//         }, { status: 404 });
//       }
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Category updated successfully',
//         data: category 
//       });
//     }
    
//     // Handle subcategory update
//     if (type === 'subcategory') {
//       const formData = await request.formData();
//       const name = formData.get('name') as string;
//       const categoryId = formData.get('categoryId') as string;
//       const imageFile = formData.get('image') as File | null;
//       const status = formData.get('status') as string;
      
//       const updateData: any = { name, categoryId, status };
      
//       if (imageFile && imageFile instanceof File && imageFile.size > 0) {
//         const bytes = await imageFile.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64Image = buffer.toString('base64');
//         const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
//         const filename = generateFilename(imageFile.name || 'subcategory.jpg');
//         const imageUrl = await saveImage(dataUrl, filename);
//         updateData.image = imageUrl;
//       } else if (formData.get('image') === '') {
//         updateData.image = '';
//       }
      
//       const subcategory = await SubCategory.findByIdAndUpdate(
//         id,
//         updateData,
//         { new: true }
//       );
      
//       if (!subcategory) {
//         return NextResponse.json({ 
//           success: false, 
//           message: 'Subcategory not found' 
//         }, { status: 404 });
//       }
      
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Subcategory updated successfully',
//         data: subcategory 
//       });
//     }
    
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Invalid type specified' 
//     }, { status: 400 });
    
//   } catch (error: any) {
//     console.error('Error in PUT:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message || 'Internal server error'
//     }, { status: 500 });
//   }
// }
// Handle PUT requests (Update)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') as string;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID is required' 
      }, { status: 400 });
    }
    
    // For product updates, handle FormData
    if (type === 'product') {
      const formData = await request.formData();
      
      const name = formData.get('name') as string;
      const subCategoryId = formData.get('subCategoryId') as string;
      const targetPestsDiseases = JSON.parse(formData.get('targetPestsDiseases') as string || '[]');
      const recommendedSeeds = JSON.parse(formData.get('recommendedSeeds') as string || '[]');
      const status = (formData.get('status') as string) || 'active';
      
      const updateData = {
        name,
        subCategoryId,
        targetPestsDiseases,
        recommendedSeeds,
        status
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
    }
    
    // Handle category update
    if (type === 'category') {
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const imageFile = formData.get('image') as File | null;
      const status = formData.get('status') as string;
      
      const updateData: any = { name, status };
      
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
        const filename = generateFilename(imageFile.name || 'category.jpg');
        const imageUrl = await saveImage(dataUrl, filename);
        updateData.image = imageUrl;
      } else if (formData.get('image') === '') {
        updateData.image = '';
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
    }
    
    // Handle subcategory update
    if (type === 'subcategory') {
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const categoryId = formData.get('categoryId') as string;
      const imageFile = formData.get('image') as File | null;
      const status = formData.get('status') as string;
      
      const updateData: any = { name, categoryId, status };
      
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${imageFile.type};base64,${base64Image}`;
        
        const filename = generateFilename(imageFile.name || 'subcategory.jpg');
        const imageUrl = await saveImage(dataUrl, filename);
        updateData.image = imageUrl;
      } else if (formData.get('image') === '') {
        updateData.image = '';
      }
      
      const subcategory = await SubCategory.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      if (!subcategory) {
        return NextResponse.json({ 
          success: false, 
          message: 'Subcategory not found' 
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Subcategory updated successfully',
        data: subcategory 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid type specified' 
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error in PUT:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
// Handle PATCH requests (Partial Update - Status Change)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') as string;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID is required' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { status } = body;
    
    let Model;
    if (type === 'category') Model = Category;
    else if (type === 'subcategory') Model = SubCategory;
    else if (type === 'product') Model = Product;
    else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid type specified' 
      }, { status: 400 });
    }
    
    const updatedDoc = await Model.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedDoc) {
      return NextResponse.json({ 
        success: false, 
        message: 'Document not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Status updated successfully',
      data: updatedDoc 
    });
    
  } catch (error: any) {
    console.error('Error in PATCH:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

// Handle DELETE requests
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') as string;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'ID is required' 
      }, { status: 400 });
    }
    
    let Model;
    if (type === 'category') Model = Category;
    else if (type === 'subcategory') Model = SubCategory;
    else if (type === 'product') Model = Product;
    else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid type specified' 
      }, { status: 400 });
    }
    
    const deletedDoc = await Model.findByIdAndDelete(id);
    
    if (!deletedDoc) {
      return NextResponse.json({ 
        success: false, 
        message: 'Document not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Document deleted successfully' 
    });
    
  } catch (error: any) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}