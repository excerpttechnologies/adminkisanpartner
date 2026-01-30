import { NextRequest, NextResponse } from 'next/server';
import Vehicle from '@/app/models/vehicles';
import connectDB from '../../../lib/Db';

// Important: Define types for Next.js 14
type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT update vehicle
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();
    const body = await request.json();
    
    // IMPORTANT: Await the params
    const params = await context.params;
    const { id } = params;
    
    console.log('Updating vehicle ID:', id);
    console.log('Update data:', body);
    
    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' }, 
        { status: 400 }
      );
    }
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    );
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(vehicle);
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update vehicle' }, 
      { status: 500 }
    );
  }
}

// DELETE vehicle
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();
    
    // IMPORTANT: Await the params
    const params = await context.params;
    const { id } = params;
    
    console.log('Deleting vehicle ID:', id);
    
    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' }, 
        { status: 400 }
      );
    }
    
    const vehicle = await Vehicle.findByIdAndDelete(id);
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Vehicle deleted successfully',
      deletedId: id
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete vehicle' }, 
      { status: 500 }
    );
  }
}