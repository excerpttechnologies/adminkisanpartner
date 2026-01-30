import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import QuantityOption from '@/app/models/QuantityOption';

// GET all quantity options with pagination and search
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'sort';
    const order = searchParams.get('order') || 'asc';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build query for search
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sort: isNaN(Number(search)) ? undefined : Number(search) }
      ].filter(Boolean);
    }
    
    // Get total count for pagination
    const total = await QuantityOption.countDocuments(query);
    
    // Determine sort order
    const sortOrder = order === 'desc' ? -1 : 1;
    
    // Fetch quantity options with pagination, search, and sorting
    const options = await QuantityOption.find(query)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        options,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    console.error('GET quantity options error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new quantity option
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, sort = 0 } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Quantity option name is required' },
        { status: 400 }
      );
    }
    
    // Check if quantity option already exists
    const existingOption = await QuantityOption.findOne({ 
      name: name.trim() 
    });
    
    if (existingOption) {
      return NextResponse.json(
        { success: false, error: 'Quantity option already exists' },
        { status: 400 }
      );
    }
    
    // Create new quantity option
    const quantityOption = await QuantityOption.create({
      name: name.trim(),
      sort: Number(sort) || 0
    });
    
    return NextResponse.json(
      { 
        success: true, 
        data: quantityOption,
        message: 'Quantity option added successfully'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST quantity option error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}