

import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import Packaging from '@/app/models/Packaging';

export const dynamic = 'force-dynamic';

// Handle all CRUD operations
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (id) {
      // GET single by ID
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
    } else {
      // GET all
      const packaging = await Packaging.find({}).sort({ createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        data: packaging,
        count: packaging.length
      });
    }
    
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch data'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    if (!body.packageType || !body.measurements) {
      return NextResponse.json({
        success: false,
        error: 'Package type and measurements are required'
      }, { status: 400 });
    }
    
    const newPackage = new Packaging({
      packageType: body.packageType,
      measurements: body.measurements.filter((m: string) => m && m.trim())
    });
    
    await newPackage.save();
    
    return NextResponse.json({
      success: true,
      data: newPackage,
      message: 'Packaging created successfully'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create packaging'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required for update'
      }, { status: 400 });
    }
    
    if (!updateData.packageType || !updateData.measurements) {
      return NextResponse.json({
        success: false,
        error: 'Package type and measurements are required'
      }, { status: 400 });
    }
    
    const updatedPackage = await Packaging.findByIdAndUpdate(
      id,
      {
        packageType: updateData.packageType,
        measurements: updateData.measurements.filter((m: string) => m && m.trim())
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
    console.error('PUT error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update packaging'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required for deletion'
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
    console.error('DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete packaging'
    }, { status: 500 });
  }
}