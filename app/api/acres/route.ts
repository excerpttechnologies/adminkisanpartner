import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Acre from '@/app/models/Acre';

// GET all acres with pagination and search
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build query for search
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Get total count for pagination
    const total = await Acre.countDocuments(query);
    
    // Determine sort order
    const sortOrder = order === 'desc' ? -1 : 1;
    
    // Fetch acres with pagination, search, and sorting
    const acres = await Acre.find(query)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        acres,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    console.error('GET acres error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new acre
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Acre name is required' },
        { status: 400 }
      );
    }
    
    // Check if acre already exists
    const existingAcre = await Acre.findOne({ 
      name: name.trim() 
    });
    
    if (existingAcre) {
      return NextResponse.json(
        { success: false, error: 'Acre already exists' },
        { status: 400 }
      );
    }
    
    // Create new acre
    const acre = await Acre.create({
      name: name.trim()
    });
    
    return NextResponse.json(
      { 
        success: true, 
        data: acre,
        message: 'Acre added successfully'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST acre error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}