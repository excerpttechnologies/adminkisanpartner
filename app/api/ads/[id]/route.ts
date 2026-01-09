

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import Advertisement from '@/app/models/AdvertisementModel';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get params
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const ad = await Advertisement.findById(id).lean();
    
    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ad
    });

  } catch (error: any) {
    console.error('Error fetching ad:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update advertisement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    console.log('Updating advertisement:', id, body);

    // Find existing ad
    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    // Update fields
    const updateData: any = {};
    
    // Only update provided fields
    if (body.heading !== undefined) updateData.heading = body.heading;
    if (body.stage !== undefined) updateData.stage = body.stage;
    if (body.tab !== undefined) updateData.tab = body.tab;
    if (body.guide !== undefined) updateData.guide = body.guide;
    if (body.companyLogo !== undefined) updateData.companyLogo = body.companyLogo;
    if (body.companyName !== undefined) updateData.companyName = body.companyName;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.advice !== undefined) updateData.advice = body.advice;
    if (body.banner !== undefined) updateData.banner = body.banner;
    
    // Update call to action
    if (body.callToAction) {
      updateData.callToAction = {
        ...existingAd.callToAction.toObject(),
        ...body.callToAction
      };
    }
    
    // Update products
    if (body.products !== undefined) {
      updateData.products = body.products.map((product: any) => ({
        ...product,
        id: product.id || uuidv4()
      }));
    }

    const updatedAd = await Advertisement.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedAd) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    console.log('Advertisement updated successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Advertisement updated successfully',
      data: updatedAd
    });

  } catch (error: any) {
    console.error('Error updating ad:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update advertisement',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE advertisement (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    console.log('Deleting advertisement:', id);

    const deletedAd = await Advertisement.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();
    
    if (!deletedAd) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    console.log('Advertisement deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Advertisement deleted successfully',
      data: deletedAd
    });

  } catch (error: any) {
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}