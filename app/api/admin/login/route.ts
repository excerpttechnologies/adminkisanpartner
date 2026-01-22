


























import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";
import { createAdminSession } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
  
    try {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
    } catch (dbError: any) {
      console.error('❌ MongoDB connection failed:', dbError.message);
      // console.error('Full DB error:', dbError);
      return NextResponse.json(
        { success: false, message: "Database connection failed", debug: dbError.message },
        { status: 500 }
      );
    }

    // ========== PARSE REQUEST BODY ==========
   
    let body;
    try {
      body = await req.json();
     
    } catch (parseError: any) {
      return NextResponse.json(
        { success: false, message: "Invalid request format" },
        { status: 400 }
      );
    }

    const { email, password } = body;
    
    // Log sanitized data (never log full password in production)
  

    // ========== VALIDATE INPUT ==========
    if (!email || !password) {
      console.log('❌ Missing credentials:', { hasEmail: !!email, hasPassword: !!password });
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ========== FIND ADMIN ==========
   
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
     
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
    
   
    // ========== CHECK PASSWORD ==========
   
    
    // Check if comparePassword method exists
    if (!admin.comparePassword || typeof admin.comparePassword !== 'function') {
     
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await admin.comparePassword(password);
    } catch (compareError: any) {
      return NextResponse.json(
        { success: false, message: "Authentication error" },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }


    // ========== CREATE SESSION ==========
    const adminData = {
      _id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role || 'subadmin',
      pageAccess: admin.pageAccess || []
    };

    
    try {
      await createAdminSession(adminData);
     
    } catch (sessionError: any) {
    
    }



    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: adminData
    });

  } catch (error: any) {
   

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












//SEED DEFAULT ADMIN

// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Admin from "@/app/models/Admin";
// import { createAdminSession } from "@/app/lib/auth";
// import bcrypt from "bcryptjs"; // You'll need to import bcrypt

// export async function POST(req: NextRequest) {
//   try {
//     console.log('🔍 === LOGIN DEBUG START ===');
//     console.log('📦 Environment Check:');
//     console.log('   NODE_ENV:', process.env.NODE_ENV);
//     console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
//     console.log('   JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
//     console.log('   JWT_SECERT first 5 chars:', process.env.JWT_SECRET?.substring(0, 5) + '...' || 'undefined');
//     console.log('   MONGODB_URI exists:', !!process.env.MONGODB_URI);
//     console.log('   All env vars with JWT:', Object.keys(process.env).filter(key => key.includes('JWT')));
//     console.log('   All env vars with MONGO:', Object.keys(process.env).filter(key => key.includes('MONGO')));
//     console.log('   Request URL:', req.url);
//     console.log('=========================================');

//     console.log('🔗 Connecting to MongoDB...');
//     try {
//       await connectDB();
//       console.log('✅ MongoDB connected successfully');
//     } catch (dbError: any) {
//       console.error('❌ MongoDB connection failed:', dbError.message);
//       console.error('Full DB error:', dbError);
//       return NextResponse.json(
//         { success: false, message: "Database connection failed", debug: dbError.message },
//         { status: 500 }
//       );
//     }

//     console.log('📥 Parsing request body...');
//     let body;
//     try {
//       body = await req.json();
//       console.log('✅ Body parsed:', { email: body?.email, passwordLength: body?.password?.length || 0 });
//     } catch (parseError: any) {
//       console.error('❌ Failed to parse request body:', parseError.message);
//       return NextResponse.json(
//         { success: false, message: "Invalid request format" },
//         { status: 400 }
//       );
//     }

//     const { email, password } = body;
    
//     console.log('👤 Login attempt:', { 
//       email, 
//       passwordProvided: !!password,
//       passwordLength: password?.length || 0,
//       timestamp: new Date().toISOString() 
//     });

//     if (!email || !password) {
//       console.log('❌ Missing credentials:', { hasEmail: !!email, hasPassword: !!password });
//       return NextResponse.json(
//         { success: false, message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // ========== ADDED: CHECK IF DEFAULT ADMIN EXISTS, CREATE IF NOT ==========
//     const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || "superadmin@example.com";
//     const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";
    
//     console.log('🔎 Checking if default admin exists:', defaultEmail);
//     let defaultAdmin = await Admin.findOne({ 
//       email: defaultEmail,
//       isDeleted: { $ne: true } 
//     });
    
//     if (!defaultAdmin) {
//       console.log('🚨 Default admin not found! Creating default super admin...');
//       console.log('🔧 Default credentials:', {
//         email: defaultEmail,
//         passwordLength: defaultPassword.length,
//         note: "These are the default credentials"
//       });
      
//       // Hash the default password
//       const hashedPassword = await bcrypt.hash(defaultPassword, 12);
//       console.log('🔑 Default password hashed');
      
//       // Create super admin
//       defaultAdmin = new Admin({
//         email: defaultEmail,
//         password: hashedPassword,
//         name: "Super Admin",
//         role: "superadmin",
//         pageAccess: [
//           "dashboard",
//           "admin notifications",
//           "users",
//           "admins",
//           "settings",
//           "reports",
//           "analytics",
//           "content",
//           "permissions"
//         ].map(module => module.toLowerCase()),
//         isActive: true,
//         isDeleted: false,
//         permissions: ["all"],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
      
//       console.log('💾 Saving default admin to database...');
//       await defaultAdmin.save();
//       console.log('✅ Default admin created successfully!');
      
//       // Log credentials (only in development)
//       if (process.env.NODE_ENV === "development") {
//         console.log('📋 DEFAULT SUPER ADMIN CREDENTIALS:');
//         console.log(`   Email: ${defaultEmail}`);
//         console.log(`   Password: ${defaultPassword}`);
//         console.log('   NOTE: Please change these credentials after first login!');
//       }
//     } else {
//       console.log('✅ Default admin already exists');
//     }

//     // ========== CHECK IF USER IS TRYING TO LOGIN WITH DEFAULT ADMIN ==========
//     if (email.toLowerCase() === defaultEmail.toLowerCase()) {
//       console.log('🔐 User is logging in with default admin credentials');
      
//       // Verify password for default admin
//       const isDefaultPasswordValid = await bcrypt.compare(password, defaultAdmin.password);
      
//       if (!isDefaultPasswordValid) {
//         console.log('❌ Default password mismatch');
//         return NextResponse.json(
//           { success: false, message: "Invalid credentials" },
//           { status: 401 }
//         );
//       }
      
//       console.log('✅ Default password verified successfully');
      
//       // Create session for default admin
//       const adminData = {
//         _id: defaultAdmin._id.toString(),
//         name: defaultAdmin.name,
//         email: defaultAdmin.email,
//         role: defaultAdmin.role || 'superadmin',
//         pageAccess: defaultAdmin.pageAccess || []
//       };

//       console.log('🎫 Creating session for default admin:', adminData.email);
      
//       try {
//         await createAdminSession(adminData);
//         console.log('✅ Session created successfully');
//       } catch (sessionError: any) {
//         console.error('❌ Session creation failed:', sessionError.message);
//         console.log('⚠️  Login succeeded but session creation failed');
//       }

//       console.log('🎉 === DEFAULT ADMIN LOGIN SUCCESSFUL ===');
//       console.log('   User:', adminData.email);
//       console.log('   Role:', adminData.role);
//       console.log('   Note: Please change default password!');
//       console.log('=========================================');

//       return NextResponse.json({
//         success: true,
//         message: "Login successful. Please change your default password.",
//         data: adminData,
//         isDefaultAdmin: true
//       });
//     }

//     // ========== FIND ADMIN (existing logic for other admins) ==========
//     console.log('🔎 Searching for admin:', email);
//     const admin = await Admin.findOne({ 
//       email,
//       isDeleted: { $ne: true } 
//     });
    
//     if (!admin) {
//       console.log('❌ Admin not found in database');
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }
    
//     console.log('✅ Admin found:', { 
//       id: admin._id?.toString()?.substring(0, 10) + '...',
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//       hasPasswordField: !!admin.password,
//       passwordFieldType: typeof admin.password
//     });

//     console.log('🔐 Checking password...');
    
//     if (!admin.comparePassword || typeof admin.comparePassword !== 'function') {
//       console.error('❌ comparePassword method is missing on admin object!');
//       console.error('Admin object methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(admin)));
//       return NextResponse.json(
//         { success: false, message: "Server configuration error" },
//         { status: 500 }
//       );
//     }

//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await admin.comparePassword(password);
//       console.log('Password validation result:', isPasswordValid);
//     } catch (compareError: any) {
//       console.error('❌ Password comparison error:', compareError.message);
//       console.error('Compare error stack:', compareError.stack);
//       return NextResponse.json(
//         { success: false, message: "Authentication error" },
//         { status: 500 }
//       );
//     }

//     if (!isPasswordValid) {
//       console.log('❌ Password mismatch');
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     console.log('✅ Password verified successfully');

//     const adminData = {
//       _id: admin._id.toString(),
//       name: admin.name,
//       email: admin.email,
//       role: admin.role || 'subadmin',
//       pageAccess: admin.pageAccess || []
//     };

//     console.log('🎫 Creating session for:', adminData.email);
    
//     try {
//       await createAdminSession(adminData);
//       console.log('✅ Session created successfully');
//     } catch (sessionError: any) {
//       console.error('❌ Session creation failed:', sessionError.message);
//       console.log('⚠️  Login succeeded but session creation failed');
//     }

//     console.log('🎉 === LOGIN SUCCESSFUL ===');
//     console.log('   User:', adminData.email);
//     console.log('   Role:', adminData.role);
//     console.log('   Time:', new Date().toISOString());
//     console.log('=========================================');

//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       data: adminData
//     });

//   } catch (error: any) {
//     console.error('💥 === UNEXPECTED LOGIN ERROR ===');
//     console.error('Error message:', error.message);
//     console.error('Error stack:', error.stack);
//     console.error('Error name:', error.name);
//     console.error('Full error object:', JSON.stringify(error, null, 2));
//     console.error('=========================================');

//     const errorMessage = process.env.NODE_ENV === 'production' 
//       ? "Login failed. Please try again." 
//       : error.message;

//     return NextResponse.json(
//       { 
//         success: false, 
//         message: errorMessage,
//         ...(process.env.NODE_ENV !== 'production' && { debug: error.message })
//       },
//       { status: 500 }
//     );
//   }
// }