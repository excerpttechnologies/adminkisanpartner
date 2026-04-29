// app/api/b2b-users/[id]/route.ts
import connectDB from '@/app/lib/Db';
import B2BUser from '@/app/models/b2bUsers';

import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    const user = await B2BUser.findById(id).select('-security.password -security.mpin');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update isActive and verificationStatus
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    
    const { verificationStatus, isActive, verifiedBy, rejectionReason } = body;
    
    // Prepare update data
    const updateData: any = {};
    
    // Update verification status if provided
    if (verificationStatus) {
      if (!['pending', 'verified', 'rejected'].includes(verificationStatus)) {
        return NextResponse.json(
          { success: false, message: 'Invalid verification status' },
          { status: 400 }
        );
      }
      
      updateData.verificationStatus = verificationStatus;
      updateData.verifiedBy = verifiedBy || 'Admin';
      updateData.verifiedDate = new Date().toISOString();
      
      if (verificationStatus === 'rejected' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
    }
    
    // Update isActive status if provided
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    
    // Check if any update data is provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update. Provide verificationStatus or isActive' },
        { status: 400 }
      );
    }
    
    // Update user
    const user = await B2BUser.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-security.password -security.mpin');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create success message
    let message = '';
    if (verificationStatus && typeof isActive === 'boolean') {
      message = `User ${verificationStatus} and ${isActive ? 'activated' : 'deactivated'} successfully`;
    } else if (verificationStatus) {
      message = `User ${verificationStatus} successfully`;
    } else if (typeof isActive === 'boolean') {
      message = `User ${isActive ? 'activated' : 'deactivated'} successfully`;
    }
    
    return NextResponse.json({
      success: true,
      message,
      user
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (optional)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    const user = await B2BUser.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}