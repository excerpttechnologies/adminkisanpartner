import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/app/lib/Db';
import AdminMenuIcon from '@/app/models/adminmenuicon';

// GET - Fetch all menu icons
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const menuIcons = await AdminMenuIcon.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: menuIcons,
      count: menuIcons.length
    });

  } catch (error: any) {
    console.error('GET /api/menuicon error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch menu icons' },
      { status: 500 }
    );
  }
}

// POST - Create new menu icon
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    if (!body.menuName || !body.menuName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Menu name is required' },
        { status: 400 }
      );
    }

    if (!body.menuIcon || !body.menuIcon.trim()) {
      return NextResponse.json(
        { success: false, error: 'Menu icon is required' },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!body.menuIcon.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format. Must be base64 encoded.' },
        { status: 400 }
      );
    }

    const menuIconData = {
      menuName: body.menuName,
      menuIcon: body.menuIcon,
      isActive: body.isActive !== undefined ? body.isActive : true
    };

    // Create menu icon
    const newMenuIcon = await AdminMenuIcon.create(menuIconData);

    console.log('Menu icon created:', newMenuIcon.menuName);

    return NextResponse.json({
      success: true,
      data: newMenuIcon,
      message: 'Menu icon created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/menuicon error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create menu icon' },
      { status: 500 }
    );
  }
}
