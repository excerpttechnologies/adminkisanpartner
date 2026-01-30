import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Seed from '@/app/models/Seed';
import mongoose from 'mongoose';

// GET all seeds with pagination and search
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const [seeds, total] = await Promise.all([
      Seed.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Seed.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: seeds,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching seeds:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new seed
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Seed name is required' },
        { status: 400 }
      );
    }

    // Check for duplicate seed name
    const existingSeed = await Seed.findOne({ 
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } 
    });
    
    if (existingSeed) {
      return NextResponse.json(
        { success: false, error: 'Seed with this name already exists' },
        { status: 400 }
      );
    }

    const seed = await Seed.create({
      name: body.name.trim(),
      description: body.description?.trim(),
      category: body.category || 'other'
    });

    return NextResponse.json({
      success: true,
      data: seed,
      message: 'Seed created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating seed:', error);
    
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