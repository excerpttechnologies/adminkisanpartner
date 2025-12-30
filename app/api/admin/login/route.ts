// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Admin from "@/app/models/Admin";
// import { createAdminSession } from "@/app/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { email, password } = await req.json();
//     console.log(email, password,process.env.JWT_SECRET)

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { success: false, message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Find admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Check password
//     const isPasswordValid = await admin.comparePassword(password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Create session (exclude password)
//     const adminData = {
//       _id: admin._id.toString(),
//       name: admin.name,
//       email: admin.email,
//       role: admin.role || 'subadmin', // Use role from DB or default
//       pageAccess: admin.pageAccess || []
//     };

//     await createAdminSession(adminData);

//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       data: adminData
//     });
//   } catch (error: any) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Login failed" },
//       { status: 500 }
//     );
//   }
// }











import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";
import { createAdminSession } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // ========== ADDED: DEBUG ENVIRONMENT VARIABLES ==========
    console.log('🔍 === LOGIN DEBUG START ===');
    console.log('📦 Environment Check:');
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('   JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
    console.log('   JWT_SECERT first 5 chars:', process.env.JWT_SECRET?.substring(0, 5) + '...' || 'undefined');
    console.log('   MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('   All env vars with JWT:', Object.keys(process.env).filter(key => key.includes('JWT')));
    console.log('   All env vars with MONGO:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    console.log('   Request URL:', req.url);
    console.log('=========================================');

    // ========== CONNECT TO DATABASE ==========
    console.log('🔗 Connecting to MongoDB...');
    try {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
    } catch (dbError: any) {
      console.error('❌ MongoDB connection failed:', dbError.message);
      console.error('Full DB error:', dbError);
      return NextResponse.json(
        { success: false, message: "Database connection failed", debug: dbError.message },
        { status: 500 }
      );
    }

    // ========== PARSE REQUEST BODY ==========
    console.log('📥 Parsing request body...');
    let body;
    try {
      body = await req.json();
      console.log('✅ Body parsed:', { email: body?.email, passwordLength: body?.password?.length || 0 });
    } catch (parseError: any) {
      console.error('❌ Failed to parse request body:', parseError.message);
      return NextResponse.json(
        { success: false, message: "Invalid request format" },
        { status: 400 }
      );
    }

    const { email, password } = body;
    
    // Log sanitized data (never log full password in production)
    console.log('👤 Login attempt:', { 
      email, 
      passwordProvided: !!password,
      passwordLength: password?.length || 0,
      timestamp: new Date().toISOString() 
    });

    // ========== VALIDATE INPUT ==========
    if (!email || !password) {
      console.log('❌ Missing credentials:', { hasEmail: !!email, hasPassword: !!password });
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ========== FIND ADMIN ==========
    console.log('🔎 Searching for admin:', email);
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log('❌ Admin not found in database');
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    console.log('✅ Admin found:', { 
      id: admin._id?.toString()?.substring(0, 10) + '...',
      name: admin.name,
      email: admin.email,
      hasPasswordField: !!admin.password,
      passwordFieldType: typeof admin.password
    });

    // ========== CHECK PASSWORD ==========
    console.log('🔐 Checking password...');
    
    // Check if comparePassword method exists
    if (!admin.comparePassword || typeof admin.comparePassword !== 'function') {
      console.error('❌ comparePassword method is missing on admin object!');
      console.error('Admin object methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(admin)));
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await admin.comparePassword(password);
      console.log('Password validation result:', isPasswordValid);
    } catch (compareError: any) {
      console.error('❌ Password comparison error:', compareError.message);
      console.error('Compare error stack:', compareError.stack);
      return NextResponse.json(
        { success: false, message: "Authentication error" },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      console.log('❌ Password mismatch');
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log('✅ Password verified successfully');

    // ========== CREATE SESSION ==========
    const adminData = {
      _id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role || 'subadmin',
      pageAccess: admin.pageAccess || []
    };

    console.log('🎫 Creating session for:', adminData.email);
    
    try {
      await createAdminSession(adminData);
      console.log('✅ Session created successfully');
    } catch (sessionError: any) {
      console.error('❌ Session creation failed:', sessionError.message);
      // Don't fail login if session creation fails, still return success
      console.log('⚠️  Login succeeded but session creation failed');
    }

    console.log('🎉 === LOGIN SUCCESSFUL ===');
    console.log('   User:', adminData.email);
    console.log('   Role:', adminData.role);
    console.log('   Time:', new Date().toISOString());
    console.log('=========================================');

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: adminData
    });

  } catch (error: any) {
    console.error('💥 === UNEXPECTED LOGIN ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    console.error('=========================================');

    // Don't expose internal errors in production
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? "Login failed. Please try again." 
      : error.message;

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        ...(process.env.NODE_ENV !== 'production' && { debug: error.message })
      },
      { status: 500 }
    );
  }
}