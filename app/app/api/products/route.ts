import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import Product from '@/app/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const farmerId = searchParams.get('farmerId');
    
    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (farmerId) query.farmerId = farmerId;
    
    // Fetch products with optional filtering
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: products 
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}