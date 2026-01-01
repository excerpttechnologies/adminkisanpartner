









// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../../../lib/Db';
// import AdminSlider from '../../../models/adminslider';

// // GET - Fetch single slider by ID
// export async function GET(
//   request: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
    
//     const { id } = await context.params;
    
//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: 'Slider ID is required' },
//         { status: 400 }
//       );
//     }

//     const slider = await AdminSlider.findById(id);
    
//     if (!slider) {
//       return NextResponse.json(
//         { success: false, message: 'Slider not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: slider
//     });
//   } catch (error: any) {
//     console.error('Error fetching slider:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch slider', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update slider by ID
// export async function PUT(
//   request: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
    
//     const { id } = await context.params;
    
//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: 'Slider ID is required' },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
    
//     // Find the existing slider first
//     const existingSlider = await AdminSlider.findById(id);
    
//     if (!existingSlider) {
//       return NextResponse.json(
//         { success: false, message: 'Slider not found' },
//         { status: 404 }
//       );
//     }
    
//     // Build update object - keep existing values if not provided
//     const updateData: any = {
//       menuName: body.menuName || existingSlider.menuName,
//       menuIcon: body.menuIcon || existingSlider.menuIcon,
//       sliderImage: body.sliderImage || existingSlider.sliderImage,
//       role: body.role || existingSlider.role,
//       status: body.status || existingSlider.status
//     };

//     // Update the slider
//     const updatedSlider = await AdminSlider.findByIdAndUpdate(
//       id,
//       updateData,
//       { 
//         new: true, // Return the updated document
//         runValidators: true // Run schema validators
//       }
//     );

//     return NextResponse.json({
//       success: true,
//       message: 'Slider updated successfully',
//       data: updatedSlider
//     });
//   } catch (error: any) {
//     console.error('Error updating slider:', error);
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map((e: any) => e.message);
//       return NextResponse.json(
//         { success: false, message: 'Validation error', errors },
//         { status: 400 }
//       );
//     }
    
//     // Handle cast errors (invalid ID format)
//     if (error.name === 'CastError') {
//       return NextResponse.json(
//         { success: false, message: 'Invalid slider ID format' },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { success: false, message: 'Failed to update slider', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete slider by ID
// export async function DELETE(
//   request: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
    
//     const { id } = await context.params;
    
//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: 'Slider ID is required' },
//         { status: 400 }
//       );
//     }

//     const deletedSlider = await AdminSlider.findByIdAndDelete(id);

//     if (!deletedSlider) {
//       return NextResponse.json(
//         { success: false, message: 'Slider not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Slider deleted successfully',
//       data: deletedSlider
//     });
//   } catch (error: any) {
//     console.error('Error deleting slider:', error);
    
//     // Handle cast errors (invalid ID format)
//     if (error.name === 'CastError') {
//       return NextResponse.json(
//         { success: false, message: 'Invalid slider ID format' },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { success: false, message: 'Failed to delete slider', error: error.message },
//       { status: 500 }
//     );
//   }
// }






















// app/api/adminslider/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import connectDB from '@/app/lib/Db';
import Slider from '@/app/models/adminslider';

// GET - Fetch single slider by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Slider ID is required' },
        { status: 400 }
      );
    }

    const slider = await Slider.findById(id);
    
    if (!slider) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: slider },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching slider:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, message: 'Invalid slider ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to fetch slider' },
      { status: 500 }
    );
  }
}

// PUT - Update slider by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Slider ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const existingSlider = await Slider.findById(id);
    
    if (!existingSlider) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      );
    }

    // Extract form data
    const menuName = formData.get('menuName') as string;
    const menuIconFile = formData.get('menuIcon') as File | null;
    const sliderImageFile = formData.get('sliderImage') as File | null;
    const role = formData.get('role') as string;
    const status = formData.get('status') as 'active' | 'inactive';

    // Validate required fields
    if (!menuName || menuName.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Menu name is required' },
        { status: 400 }
      );
    }

    // Check for duplicate menu name
    if (menuName.trim() !== existingSlider.menuName) {
      const duplicateSlider = await Slider.findOne({
        menuName: menuName.trim(),
        _id: { $ne: id }
      });
      
      if (duplicateSlider) {
        return NextResponse.json(
          { success: false, message: 'Another slider with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      menuName: menuName.trim(),
      role: role || '',
      status: status || 'active'
    };

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Handle icon update if new file is provided
    if (menuIconFile && menuIconFile.size > 0) {
      // Delete old icon file if it exists
      if (existingSlider.menuIcon) {
        try {
          const oldIconPath = join(process.cwd(), 'public', existingSlider.menuIcon);
          if (existsSync(oldIconPath)) {
            await unlink(oldIconPath);
          }
        } catch (error) {
          console.warn('Error deleting old icon:', error);
          // Continue with update even if old file deletion fails
        }
      }

      // Save new icon
      const timestamp = Date.now();
      const originalName = menuIconFile.name || 'icon';
      const iconExt = originalName.split('.').pop() || 'png';
      const iconFilename = `icon_${timestamp}.${iconExt}`;
      
      const iconBytes = await menuIconFile.arrayBuffer();
      const iconBuffer = Buffer.from(iconBytes);
      const iconPath = join(uploadsDir, iconFilename);
      await writeFile(iconPath, iconBuffer);

      updateData.menuIcon = `/uploads/${iconFilename}`;
    }

    // Handle slider image update if new file is provided
    if (sliderImageFile && sliderImageFile.size > 0) {
      // Delete old slider image if it exists
      if (existingSlider.sliderImage) {
        try {
          const oldSliderPath = join(process.cwd(), 'public', existingSlider.sliderImage);
          if (existsSync(oldSliderPath)) {
            await unlink(oldSliderPath);
          }
        } catch (error) {
          console.warn('Error deleting old slider image:', error);
          // Continue with update even if old file deletion fails
        }
      }

      // Save new slider image
      const timestamp = Date.now();
      const originalName = sliderImageFile.name || 'slider';
      const sliderExt = originalName.split('.').pop() || 'jpg';
      const sliderFilename = `slider_${timestamp}.${sliderExt}`;
      
      const sliderBytes = await sliderImageFile.arrayBuffer();
      const sliderBuffer = Buffer.from(sliderBytes);
      const sliderPath = join(uploadsDir, sliderFilename);
      await writeFile(sliderPath, sliderBuffer);

      updateData.sliderImage = `/uploads/${sliderFilename}`;
    }

    // Update slider in database
    const updatedSlider = await Slider.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Slider updated successfully',
        data: updatedSlider 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating slider:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors },
        { status: 400 }
      );
    }
    
    // Handle cast errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, message: 'Invalid slider ID format' },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Slider with this name already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update slider',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Slider ID is required' },
        { status: 400 }
      );
    }

    const slider = await Slider.findById(id);
    
    if (!slider) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      );
    }

    // Delete image files
    if (slider.menuIcon) {
      try {
        const iconPath = join(process.cwd(), 'public', slider.menuIcon);
        if (existsSync(iconPath)) {
          await unlink(iconPath);
        }
      } catch (error) {
        console.warn('Error deleting icon file:', error);
        // Continue with deletion even if file deletion fails
      }
    }
    
    if (slider.sliderImage) {
      try {
        const sliderPath = join(process.cwd(), 'public', slider.sliderImage);
        if (existsSync(sliderPath)) {
          await unlink(sliderPath);
        }
      } catch (error) {
        console.warn('Error deleting slider image:', error);
        // Continue with deletion even if file deletion fails
      }
    }

    // Delete from database
    await Slider.findByIdAndDelete(id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Slider deleted successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error deleting slider:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, message: 'Invalid slider ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete slider',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}