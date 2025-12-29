import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/app/lib/Db';
import Profile from '@/app/models/Profile';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get session
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find profile (exclude password)
    const profile = await Profile.findOne(
      { email: session.user.email },
      { password: 0 } // Exclude password from response
    );

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        profile,
        message: 'Profile retrieved successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}