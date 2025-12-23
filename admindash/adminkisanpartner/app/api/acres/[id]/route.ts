import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Acre from '@/app/models/Acre';
import mongoose from 'mongoose';

// GET single acre by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid acre ID' },
        { status: 400 }
      );
    }
    
    const acre = await Acre.findById(id).lean();
    
    if (!acre) {
      return NextResponse.json(
        { success: false, error: 'Acre not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: acre
    });
  } catch (error: any) {
    console.error('GET acre error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update acre
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid acre ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Acre name is required' },
        { status: 400 }
      );
    }
    
    // Check if another acre with same name exists
    const existingAcre = await Acre.findOne({ 
      name: name.trim(),
      _id: { $ne: new mongoose.Types.ObjectId(id) }
    });
    
    if (existingAcre) {
      return NextResponse.json(
        { success: false, error: 'Acre name already exists' },
        { status: 400 }
      );
    }
    
    // Update acre
    const acre = await Acre.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!acre) {
      return NextResponse.json(
        { success: false, error: 'Acre not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: acre,
      message: 'Acre updated successfully'
    });
  } catch (error: any) {
    console.error('PUT acre error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE acre
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid acre ID' },
        { status: 400 }
      );
    }
    
    const acre = await Acre.findByIdAndDelete(id).lean();
    
    if (!acre) {
      return NextResponse.json(
        { success: false, error: 'Acre not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Acre deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE acre error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}