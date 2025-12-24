import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import AdminSlider from '../../../models/adminslider';

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

    const slider = await AdminSlider.findById(id);
    
    if (!slider) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: slider
    });
  } catch (error: any) {
    console.error('Error fetching slider:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch slider', error: error.message },
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

    const body = await request.json();
    
    // Find the existing slider first
    const existingSlider = await AdminSlider.findById(id);
    
    if (!existingSlider) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      );
    }
    
    // Build update object - keep existing values if not provided
    const updateData: any = {
      menuName: body.menuName || existingSlider.menuName,
      menuIcon: body.menuIcon || existingSlider.menuIcon,
      sliderImage: body.sliderImage || existingSlider.sliderImage,
      status: body.status || existingSlider.status
    };

    // Update the slider
    const updatedSlider = await AdminSlider.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Slider updated successfully',
      data: updatedSlider
    });
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
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, message: 'Invalid slider ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update slider', error: error.message },
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

    const deletedSlider = await AdminSlider.findByIdAndDelete(id);

    if (!deletedSlider) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Slider deleted successfully',
      data: deletedSlider
    });
  } catch (error: any) {
    console.error('Error deleting slider:', error);
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, message: 'Invalid slider ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to delete slider', error: error.message },
      { status: 500 }
    );
  }
}