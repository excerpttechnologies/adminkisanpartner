import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import connectDB from '@/app/lib/Db';
import Slider from '@/app/models/adminslider';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    
    const menuName = formData.get('menuName') as string;
    const menuIconFile = formData.get('menuIcon') as File;
    const sliderImageFile = formData.get('sliderImage') as File;
    const role = formData.get('role') as string;
    const status = formData.get('status') as 'active' | 'inactive';

    // Validate required fields
    if (!menuName || !menuIconFile || !sliderImageFile) {
      return NextResponse.json(
        { success: false, message: 'Menu name, icon, and slider image are required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const iconExt = menuIconFile.name.split('.').pop();
    const sliderExt = sliderImageFile.name.split('.').pop();
    
    const iconFilename = `icon_${timestamp}.${iconExt}`;
    const sliderFilename = `slider_${timestamp}.${sliderExt}`;

    // Save files to server
    const iconBytes = await menuIconFile.arrayBuffer();
    const iconBuffer = Buffer.from(iconBytes);
    const iconPath = join(uploadsDir, iconFilename);
    await writeFile(iconPath, iconBuffer);

    const sliderBytes = await sliderImageFile.arrayBuffer();
    const sliderBuffer = Buffer.from(sliderBytes);
    const sliderPath = join(uploadsDir, sliderFilename);
    await writeFile(sliderPath, sliderBuffer);

    // Create URLs for database storage
    const menuIconUrl = `/uploads/${iconFilename}`;
    const sliderImageUrl = `/uploads/${sliderFilename}`;

    // Create new slider in database
    const slider = new Slider({
      menuName,
      menuIcon: menuIconUrl,
      sliderImage: sliderImageUrl,
      role: role || '',
      status: status || 'active'
    });

    await slider.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Slider created successfully',
        data: slider 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating slider:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create slider',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const sliders = await Slider.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: sliders },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sliders' },
      { status: 500 }
    );
  }
}