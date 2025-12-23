import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Cattle from '@/app/models/Cattle';
import mongoose from 'mongoose';

// GET all cattle with pagination and search
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'sortOrder';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [cattles, total] = await Promise.all([
      Cattle.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Cattle.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: cattles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching cattle:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new cattle
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Cattle name is required' },
        { status: 400 }
      );
    }

    // Check for duplicate cattle name
    const existingCattle = await Cattle.findOne({ 
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } 
    });
    
    if (existingCattle) {
      return NextResponse.json(
        { success: false, error: 'Cattle with this name already exists' },
        { status: 400 }
      );
    }

    // Get max sortOrder to set default
    const maxSortOrder = await Cattle.findOne({}).sort('-sortOrder').select('sortOrder');
    const defaultSortOrder = maxSortOrder ? maxSortOrder.sortOrder + 1 : 1;

    const cattle = await Cattle.create({
      name: body.name.trim(),
      sortOrder: body.sortOrder || defaultSortOrder
    });

    return NextResponse.json({
      success: true,
      data: cattle,
      message: 'Cattle created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating cattle:', error);
    
    // Handle mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}