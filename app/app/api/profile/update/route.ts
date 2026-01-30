// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { getToken } from 'next-auth/jwt';
// import dbConnect from '@/app/lib/Db'; // Your DB connection utility
// import Admin from '@/app/models/Admin'; // Your Admin model

// export async function POST(req: NextRequest) {
//   try {
//     // 1. Connect to database
//     await dbConnect();

//     // 2. Get the current user from session/token
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
//     if (!token || !token.email) {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized. Please login again.' },
//         { status: 401 }
//       );
//     }

//     // 3. Parse request body
//     const body = await req.json();
//     const { fullName, password, email: bodyEmail } = body;

//     // 4. Find the user in database (use email from token for security)
//     const user = await Admin.findOne({ 
//       email: token.email,
//       isDeleted: false 
//     });

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // 5. Prepare update data
//     const updateData: any = {};
    
//     // Update name if provided and different
//     if (fullName && fullName.trim() !== user.name) {
//       updateData.name = fullName.trim();
//     }

//     // Update password if provided
//     if (password && password.trim() !== '') {
//       // Validate password length
//       if (password.length < 6) {
//         return NextResponse.json(
//           { success: false, message: 'Password must be at least 6 characters long' },
//           { status: 400 }
//         );
//       }
//       // Hash new password
//       updateData.password = await bcrypt.hash(password, 10);
//     }

//     // 6. Check if there's anything to update
//     if (Object.keys(updateData).length === 0) {
//       return NextResponse.json(
//         { success: false, message: 'No changes detected' },
//         { status: 400 }
//       );
//     }

//     // 7. Update user in database
//     const updatedUser = await Admin.findOneAndUpdate(
//       { email: token.email },
//       { $set: updateData },
//       { new: true, runValidators: true } // Return updated document
//     ).select('-password'); // Exclude password from response

//     if (!updatedUser) {
//       return NextResponse.json(
//         { success: false, message: 'Failed to update profile' },
//         { status: 500 }
//       );
//     }

//     // 8. Return success response
//     return NextResponse.json({
//       success: true,
//       message: 'Profile updated successfully',
//       user: {
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role,
//         state: updatedUser.state,
//         district: updatedUser.district,
//         commodity: updatedUser.commodity,
//         updatedAt: updatedUser.updatedAt
//       }
//     });

//   } catch (error: any) {
//     console.error('Profile update error:', error);

//     // Handle specific error cases
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map((err: any) => err.message);
//       return NextResponse.json(
//         { success: false, message: messages.join(', ') },
//         { status: 400 }
//       );
//     }

//     if (error.code === 11000) {
//       return NextResponse.json(
//         { success: false, message: 'Email already exists' },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         success: false, 
//         message: error.message || 'Internal server error' 
//       },
//       { status: 500 }
//     );
//   }
// }

// // Optional: GET method to fetch current profile
// export async function GET(req: NextRequest) {
//   try {
//     await dbConnect();
    
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
//     if (!token || !token.email) {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const user = await Admin.findOne({ 
//       email: token.email,
//       isDeleted: false 
//     }).select('-password -resetToken -resetTokenExpiry');

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       user
//     });

//   } catch (error: unknown) {
//     console.error('Fetch profile error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }








import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/Db';
import Admin from '@/app/models/Admin';
import { getAdminSession } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  try {
    console.log('📥 GET Profile API called');
    
    // Get admin session
    const session = await getAdminSession();
    
    if (!session || !session.admin) {
      console.log('❌ No valid admin session found');
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized. Please login." 
        },
        { status: 401 }
      );
    }

    console.log('✅ Session found for admin:', session.admin.email);
    
    // Connect to database
    await dbConnect();
    
    // Find admin by ID from session
    const admin = await Admin.findById(session.admin._id)
      .select('-password -resetToken -resetTokenExpiry -isDeleted');
    
    if (!admin) {
      console.log('❌ Admin not found in database for ID:', session.admin._id);
      return NextResponse.json(
        { 
          success: false, 
          message: "Admin not found" 
        },
        { status: 404 }
      );
    }

    console.log('✅ Admin found:', admin.email);
    
    return NextResponse.json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        state: admin.state,
        district: admin.district,
        commodity: admin.commodity,
        pageAccess: admin.pageAccess,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });

  } catch (error: any) {
    console.error('❌ GET Profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Internal server error" 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('📥 POST Profile Update API called');
    
    // Get admin session
    const session = await getAdminSession();
    
    if (!session || !session.admin) {
      console.log('❌ No valid admin session for update');
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized. Please login." 
        },
        { status: 401 }
      );
    }

    console.log('✅ Session found for update:', session.admin.email);
    
    // Parse request body
    const body = await req.json();
    const { fullName, password } = body;

    console.log('📦 Update request body:', { 
      fullName: fullName ? `${fullName.substring(0, 10)}...` : 'empty',
      password: password ? 'provided' : 'not provided' 
    });

    // Validate full name
    if (!fullName || !fullName.trim()) {
      console.log('❌ Full name validation failed');
      return NextResponse.json(
        { 
          success: false, 
          message: "Full Name is required" 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find admin
    const admin = await Admin.findById(session.admin._id);
    
    if (!admin) {
      console.log('❌ Admin not found for update');
      return NextResponse.json(
        { 
          success: false, 
          message: "Admin not found" 
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    // Update name if changed
    if (fullName.trim() !== admin.name) {
      updateData.name = fullName.trim();
      console.log('📝 Name will be updated');
    }

    // Update password if provided
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        console.log('❌ Password too short');
        return NextResponse.json(
          { 
            success: false, 
            message: "Password must be at least 6 characters" 
          },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
      console.log('🔐 Password will be updated');
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      console.log('ℹ️ No changes detected');
      return NextResponse.json(
        { 
          success: false, 
          message: "No changes detected" 
        },
        { status: 400 }
      );
    }

    console.log('🔄 Updating admin with data:', updateData);

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      session.admin._id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password -resetToken -resetTokenExpiry -isDeleted');

    if (!updatedAdmin) {
      console.log('❌ Admin update failed');
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to update profile" 
        },
        { status: 500 }
      );
    }

    console.log('✅ Profile updated successfully for:', updatedAdmin.email);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        updatedAt: updatedAdmin.updatedAt
      }
    });

  } catch (error: any) {
    console.error('❌ POST Profile Update error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: messages.join(', ') 
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email already exists" 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Internal server error" 
      },
      { status: 500 }
    );
  }
}