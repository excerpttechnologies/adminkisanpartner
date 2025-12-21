import connectDB from '@/app/lib/Db';
import District from '@/app/models/District';
import Taluka from '@/app/models/Taluka';
import { NextRequest, NextResponse } from 'next/server';


// GET /api/talukas/[id] - Get single taluka
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<> }
) {
  try {
    await connectDB();
    
    const { id } = params;

    const taluka = await Taluka.findById(id)
      .populate('district', 'name')
      .lean();

    if (!taluka) {
      return NextResponse.json(
        { success: false, message: 'Taluka not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...taluka,
        districtName: (taluka.district as any)?.name || 'Unknown District'
      }
    });
  } catch (error: any) {
    console.error('Error fetching taluka:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch taluka' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/talukas/[id] - Update taluka
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<> }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { name, district } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Taluka name is required' },
        { status: 400 }
      );
    }

    if (!district) {
      return NextResponse.json(
        { success: false, message: 'District is required' },
        { status: 400 }
      );
    }

    // Check if taluka exists
    const existingTaluka = await Taluka.findById(id);
    if (!existingTaluka) {
      return NextResponse.json(
        { success: false, message: 'Taluka not found' },
        { status: 404 }
      );
    }

    // Check if district exists
    const districtExists = await District.findById(district);
    if (!districtExists) {
      return NextResponse.json(
        { success: false, message: 'District not found' },
        { status: 404 }
      );
    }

    // Check if another taluka with same name exists in the same district
    const duplicateTaluka = await Taluka.findOne({
      _id: { $ne: id },
      name: name.trim(),
      district
    });
    if (duplicateTaluka) {
      return NextResponse.json(
        { success: false, message: 'Taluka already exists in this district' },
        { status: 400 }
      );
    }

    // Update taluka
    const updatedTaluka = await Taluka.findByIdAndUpdate(
      id,
      { name: name.trim(), district },
      { new: true }
    ).populate('district', 'name').lean();

    return NextResponse.json({
      success: true,
      message: 'Taluka updated successfully',
      data: {
        ...updatedTaluka,
        districtName: (updatedTaluka?.district as any)?.name || 'Unknown District'
      }
    });
  } catch (error: any) {
    console.error('Error updating taluka:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to update taluka' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/talukas/[id] - Delete single taluka
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<> }
) {
  try {
    await connectDB();
    
    const { id } = params;

    const taluka = await Taluka.findByIdAndDelete(id);

    if (!taluka) {
      return NextResponse.json(
        { success: false, message: 'Taluka not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Taluka deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting taluka:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete taluka' 
      },
      { status: 500 }
    );
  }
}