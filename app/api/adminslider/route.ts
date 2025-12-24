import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/Db';
import AdminSlider from '../../models/adminslider';

// GET - Fetch all sliders
export async function GET() {
  try {
    await connectDB();
    const sliders = await AdminSlider.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: sliders,
      count: sliders.length
    });
  } catch (error: any) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sliders', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new slider
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate required fields
    if (!body.menuName || !body.menuIcon || !body.sliderImage) {
      return NextResponse.json(
        { success: false, message: 'Menu name, icon, and slider image are required' },
        { status: 400 }
      );
    }

    const newSlider = await AdminSlider.create({
      menuName: body.menuName,
      menuIcon: body.menuIcon,
      sliderImage: body.sliderImage,
      status: body.status || 'active'
    });

    return NextResponse.json({
      success: true,
      message: 'Slider created successfully',
      data: newSlider
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating slider:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create slider', error: error.message },
      { status: 500 }
    );
  }
}