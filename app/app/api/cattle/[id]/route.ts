import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Cattle from '@/app/models/Cattle';
import mongoose from 'mongoose';

// GET single cattle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid cattle ID' },
        { status: 400 }
      );
    }

    const cattle = await Cattle.findById(id);
    
    if (!cattle) {
      return NextResponse.json(
        { success: false, error: 'Cattle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cattle
    });

  } catch (error: any) {
    console.error('Error fetching cattle:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update cattle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid cattle ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Cattle name is required' },
        { status: 400 }
      );
    }

    // Check if cattle exists
    const existingCattle = await Cattle.findById(id);
    if (!existingCattle) {
      return NextResponse.json(
        { success: false, error: 'Cattle not found' },
        { status: 404 }
      );
    }

    // Check for duplicate cattle name (excluding current cattle)
    const duplicateCattle = await Cattle.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') }
    });
    
    if (duplicateCattle) {
      return NextResponse.json(
        { success: false, error: 'Cattle with this name already exists' },
        { status: 400 }
      );
    }

    // Update cattle
    const cattle = await Cattle.findByIdAndUpdate(
      id,
      {
        name: body.name.trim(),
        sortOrder: body.sortOrder || existingCattle.sortOrder
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: cattle,
      message: 'Cattle updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating cattle:', error);
    
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

// DELETE cattle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid cattle ID' },
        { status: 400 }
      );
    }

    const cattle = await Cattle.findByIdAndDelete(id);
    
    if (!cattle) {
      return NextResponse.json(
        { success: false, error: 'Cattle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cattle deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting cattle:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}