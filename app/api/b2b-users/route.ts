
import connectDB from '@/app/lib/Db';
import B2BUser from '@/app/models/b2bUsers';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,) {
  try {
    await connectDB();
  
    
    const users = await B2BUser.find({}).select('-security.password -security.mpin');
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No users found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      users
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}