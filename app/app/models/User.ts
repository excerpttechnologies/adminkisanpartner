import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Connect to database
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI || 'your-mongodb-uri');
}

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Access the model directly from mongoose
    const User = mongoose.model('User');
    const user = await User.findOne({ email: email }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate full name
    if (data.fullName?.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name cannot be empty' },
        { status: 400 }
      );
    }

    if (data.fullName && data.fullName.length > 100) {
      return NextResponse.json(
        { error: 'Full name cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    // Access the model directly from mongoose
    const User = mongoose.model('User');
    const user = await User.findOne({ email: data.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (data.fullName) user.fullName = data.fullName;
    if (data.profileImage !== undefined) user.profileImage = data.profileImage;
    user.updatedAt = new Date();
    
    // Handle password update
    if (data.password?.trim()) {
      if (data.password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      
      user.password = await bcrypt.hash(data.password, 10);
    }

    // Save the user
    const updatedUser = await user.save();
    
    // Prepare response without password
    const userData = updatedUser.toObject();
    delete userData.password;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: userData._id.toString(),
        fullName: userData.fullName,
        email: userData.email,
        profileImage: userData.profileImage,
        updatedAt: userData.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}