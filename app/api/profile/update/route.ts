import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/app/lib/Db';
import Profile from '@/app/models/Profile';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { fullName, password, email } = await request.json();

    // For testing - hardcode email or get from session
    const userEmail = email || 'test@example.com'; // Change this

    // Find or create profile for testing
    let profile = await Profile.findOne({ email: userEmail });
    
    if (!profile) {
      // Create a test profile if doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'Test@123', salt);
      
      profile = new Profile({
        fullName: fullName || 'Test User',
        email: userEmail,
        password: hashedPassword
      });
    } else {
      // Update existing profile
      profile.fullName = fullName || profile.fullName;
      
      if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        profile.password = await bcrypt.hash(password, salt);
      }
    }

    await profile.save();

    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        profile: {
          fullName: profile.fullName,
          email: profile.email,
          updatedAt: profile.updatedAt
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}