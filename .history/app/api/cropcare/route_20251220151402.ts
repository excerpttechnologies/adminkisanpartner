import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/Db';
import { Category, SubCategory, Product } from '@/app/models/Category';

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
    console.error('Error in GET:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}