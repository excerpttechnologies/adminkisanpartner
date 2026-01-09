

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/Db';
import Advertisement from '../../models/AdvertisementModel';
import { v4 as uuidv4 } from 'uuid';

// GET all advertisements with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const tab = searchParams.get('tab') || 'tab01';
    const stage = searchParams.get('stage');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isActive: true };
    
    if (tab) {
      query.tab = tab;
    }
    
    if (stage) {
      query.stage = stage;
    }

    console.log('Fetching ads with query:', { query, skip, limit });

    // Execute query
    const [ads, total] = await Promise.all([
      Advertisement.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Advertisement.countDocuments(query)
    ]);

    console.log(`Found ${ads.length} advertisements`);

    return NextResponse.json({
      success: true,
      data: ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch advertisements',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST create new advertisement
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    console.log('Creating advertisement with data:', {
      ...body,
      products: body.products?.length || 0
    });

    // Validate required fields
    if (!body.heading || !body.heading.trim()) {
      return NextResponse.json(
        { success: false, error: 'Heading is required' },
        { status: 400 }
      );
    }

    if (!body.stage) {
      return NextResponse.json(
        { success: false, error: 'Stage is required' },
        { status: 400 }
      );
    }

    // Generate IDs for products if not provided
    const productsWithIds = body.products?.map((product: any) => ({
      ...product,
      id: product.id || uuidv4()
    })) || [];

    // Create new advertisement
    const newAd = new Advertisement({
      stage: body.stage,
      tab: body.tab || 'tab01',
      heading: body.heading,
      guide: body.guide || '',
      companyLogo: body.companyLogo || '',
      companyName: body.companyName || '',
      description: body.description || '',
      advice: body.advice || '',
      banner: body.banner || '',
      callToAction: {
        buyNowLink: body.callToAction?.buyNowLink || '',
        visitWebsiteLink: body.callToAction?.visitWebsiteLink || '',
        callNowNumber: body.callToAction?.callNowNumber || '',
        whatsappNowNumber: body.callToAction?.whatsappNowNumber || '',
        price: body.callToAction?.price || 0,
        selectedAction: body.callToAction?.selectedAction || 'buyNow',
      },
      products: productsWithIds,
      isActive: true,
    });

    const savedAd = await newAd.save();
    console.log('Advertisement created successfully:', savedAd._id);

    return NextResponse.json({
      success: true,
      message: 'Advertisement created successfully',
      data: savedAd
    });

  } catch (error: any) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create advertisement',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}