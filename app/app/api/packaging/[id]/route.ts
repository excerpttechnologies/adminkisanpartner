





import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import Packaging from '@/app/models/Packaging';

// This is important for Next.js App Router
export const dynamic = 'force-dynamic';

// Helper to extract ID from params
async function getParams(request: Request): Promise<{ id: string }> {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop() || '';
  return { id };
}

// GET single packaging by ID
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { id } = await getParams(request);
    console.log('🔍 GET by ID called with:', id);
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required'
      }, { status: 400 });
    }
    
    const packaging = await Packaging.findById(id);
    
    if (!packaging) {
      return NextResponse.json({
        success: false,
        error: 'Packaging not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: packaging
    });
    
  } catch (error: any) {
    console.error('❌ GET by ID error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch packaging'
    }, { status: 500 });
  }
}

// PUT update packaging
export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const { id } = await getParams(request);
    const body = await request.json();
    
    console.log('✏️ PUT called with id:', id, 'body:', body);
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required'
      }, { status: 400 });
    }
    
    if (!body.packageType || !body.measurements) {
      return NextResponse.json({
        success: false,
        error: 'Package type and measurements are required'
      }, { status: 400 });
    }
    
    const updatedPackage = await Packaging.findByIdAndUpdate(
      id,
      {
        packageType: body.packageType,
        measurements: body.measurements.filter((m: string) => m && m.trim())
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return NextResponse.json({
        success: false,
        error: 'Packaging not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: updatedPackage,
      message: 'Packaging updated successfully'
    });
    
  } catch (error: any) {
    console.error('❌ PUT error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update packaging'
    }, { status: 500 });
  }
}

// DELETE packaging
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { id } = await getParams(request);
    console.log('🗑️ DELETE called with id:', id);
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required'
      }, { status: 400 });
    }
    
    const deletedPackage = await Packaging.findByIdAndDelete(id);
    
    if (!deletedPackage) {
      return NextResponse.json({
        success: false,
        error: 'Packaging not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Packaging deleted successfully'
    });
    
  } catch (error: any) {
    console.error('❌ DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete packaging'
    }, { status: 500 });
  }
}