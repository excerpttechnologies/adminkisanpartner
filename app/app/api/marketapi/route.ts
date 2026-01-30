

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import Market from '@/app/models/Marketdb';

export async function GET(request: NextRequest) {
  console.log('=== GET /api/markets called ===');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✓ Database connected');
    
    // Fetch all markets
    const markets = await Market.find({}).sort({ createdAt: -1 });
    console.log(`✓ Found ${markets.length} markets`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Markets fetched successfully',
      count: markets.length,
      markets: markets
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('✗ GET Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch market data',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('=== POST /api/markets called ===');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✓ Database connected');
    
    // Parse request body
    const body = await request.json();
    console.log('✓ Request body:', body);
    
    // Validate required fields
    const requiredFields = ['marketName', 'pincode', 'postOffice', 'district', 'state', 'exactAddress'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields: missingFields
        },
        { status: 400 }
      );
    }
    
    // Generate market ID
    const marketId = `MKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`✓ Generated marketId: ${marketId}`);
    
    // Create new market
    const newMarket = new Market({
      marketId: marketId,
      marketName: body.marketName,
      pincode: body.pincode,
      postOffice: body.postOffice,
      district: body.district,
      state: body.state,
      exactAddress: body.exactAddress,
      landmark: body.landmark || ''
    });
    
    // Save to database
    const savedMarket = await newMarket.save();
    console.log('✓ Market saved successfully:', savedMarket._id);
    
    return NextResponse.json({
      success: true,
      message: 'Market created successfully',
      market: savedMarket
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('✗ POST Error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Market ID already exists',
          details: 'Duplicate marketId detected'
        },
        { status: 409 }
      );
    }
    
    // Handle validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create market',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}