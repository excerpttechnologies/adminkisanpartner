import { NextRequest, NextResponse } from 'next/server';
import connectDB from "@/app/lib/Db";
import crypto from 'crypto';
import Admin from '@/app/models/Admin';
import { sendPasswordResetEmail } from '@/app/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const user = await Admin.findOne({ email });
 
    // For security, don't reveal if user doesn't exist
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive reset instructions.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
   const check= await Admin.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpiry
        }
      }
    );
 
    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail(email, resetLink);
      
      return NextResponse.json({
        success: true,
        message: 'Password reset instructions have been sent to your email.'
      });
    } catch (emailError) {
      // Remove token if email fails
      await Admin.updateOne(
        { _id: user._id },
        {
          $unset: {
            resetToken: "",
            resetTokenExpiry: ""
          }
        }
      );

      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { success: false, message: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}