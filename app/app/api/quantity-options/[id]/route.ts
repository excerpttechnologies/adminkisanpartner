import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import QuantityOption from '@/app/models/QuantityOption';
import mongoose from 'mongoose';

// GET single quantity option by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity option ID' },
        { status: 400 }
      );
    }
    
    const option = await QuantityOption.findById(id).lean();
    
    if (!option) {
      return NextResponse.json(
        { success: false, error: 'Quantity option not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: option
    });
  } catch (error: any) {
    console.error('GET quantity option error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update quantity option
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity option ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, sort } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Quantity option name is required' },
        { status: 400 }
      );
    }
    
    // Check if another option with same name exists
    const existingOption = await QuantityOption.findOne({ 
      name: name.trim(),
      _id: { $ne: new mongoose.Types.ObjectId(id) }
    });
    
    if (existingOption) {
      return NextResponse.json(
        { success: false, error: 'Quantity option name already exists' },
        { status: 400 }
      );
    }
    
    // Update quantity option
    const option = await QuantityOption.findByIdAndUpdate(
      id,
      { 
        name: name.trim(),
        sort: Number(sort) || 0
      },
      { new: true, runValidators: true }
    ).lean();
    
    if (!option) {
      return NextResponse.json(
        { success: false, error: 'Quantity option not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: option,
      message: 'Quantity option updated successfully'
    });
  } catch (error: any) {
    console.error('PUT quantity option error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE quantity option
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity option ID' },
        { status: 400 }
      );
    }
    
    const option = await QuantityOption.findByIdAndDelete(id).lean();
    
    if (!option) {
      return NextResponse.json(
        { success: false, error: 'Quantity option not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Quantity option deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE quantity option error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}