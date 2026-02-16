


























// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Admin from "@/app/models/Admin";
// import { createAdminSession } from "@/app/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
  
//     try {
//       await connectDB();
//       console.log('✅ MongoDB connected successfully');
//     } catch (dbError: any) {
//       console.error('❌ MongoDB connection failed:', dbError.message);
//       // console.error('Full DB error:', dbError);
//       return NextResponse.json(
//         { success: false, message: "Database connection failed", debug: dbError.message },
//         { status: 500 }
//       );
//     }

//     // ========== PARSE REQUEST BODY ==========
   
//     let body;
//     try {
//       body = await req.json();
     
//     } catch (parseError: any) {
//       return NextResponse.json(
//         { success: false, message: "Invalid request format" },
//         { status: 400 }
//       );
//     }

//     const { email, password } = body;
    
//     // Log sanitized data (never log full password in production)
  

//     // ========== VALIDATE INPUT ==========
//     if (!email || !password) {
//       console.log('❌ Missing credentials:', { hasEmail: !!email, hasPassword: !!password });
//       return NextResponse.json(
//         { success: false, message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // ========== FIND ADMIN ==========
   
//     const admin = await Admin.findOne({ email });
    
//     if (!admin) {
     
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }
    
   
//     // ========== CHECK PASSWORD ==========
   
    
//     // Check if comparePassword method exists
//     if (!admin.comparePassword || typeof admin.comparePassword !== 'function') {
     
//       return NextResponse.json(
//         { success: false, message: "Server configuration error" },
//         { status: 500 }
//       );
//     }

//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await admin.comparePassword(password);
//     } catch (compareError: any) {
//       return NextResponse.json(
//         { success: false, message: "Authentication error" },
//         { status: 500 }
//       );
//     }

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }


//     // ========== CREATE SESSION ==========
//     const adminData = {
//       _id: admin._id.toString(),
//       name: admin.name,
//       email: admin.email,
//       role: admin.role || 'subadmin',
//        state: admin.state,
//       district: admin.district,
//       taluka: admin.taluka,

//       pageAccess: admin.pageAccess || []
//     };

    
//     try {
//       await createAdminSession(adminData);
     
//     } catch (sessionError: any) {
    
//     }



//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       data: adminData
//     });

//   } catch (error: any) {
   

//     // Don't expose internal errors in production
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








// // app/api/admin/login/route.ts (or your current file)
// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Admin from "@/app/models/Admin";
// import { createAdminSession } from "@/app/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     console.log('✅ MongoDB connected successfully');

//     // ========== PARSE REQUEST BODY ==========
//     let body;
//     try {
//       body = await req.json();
//     } catch (parseError: any) {
//       return NextResponse.json(
//         { success: false, message: "Invalid request format" },
//         { status: 400 }
//       );
//     }

//     const { email, password } = body;

//     // ========== VALIDATE INPUT ==========
//     if (!email || !password) {
//       return NextResponse.json(
//         { success: false, message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // ========== FIND ADMIN ==========
//     const admin = await Admin.findOne({ email });
    
//     if (!admin) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // ========== CHECK PASSWORD ==========
//     if (!admin.comparePassword || typeof admin.comparePassword !== 'function') {
//       return NextResponse.json(
//         { success: false, message: "Server configuration error" },
//         { status: 500 }
//       );
//     }

//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await admin.comparePassword(password);
//     } catch (compareError: any) {
//       return NextResponse.json(
//         { success: false, message: "Authentication error" },
//         { status: 500 }
//       );
//     }

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // ========== PREPARE ADMIN DATA WITH LOCATION ==========
//     const adminData = {
//       _id: admin._id.toString(),
//       name: admin.name,
//       email: admin.email,
//       role: admin.role || 'subadmin',
//       // Store location data as arrays for flexibility
//       // states: admin.states || (admin.state ? [admin.state] : []),
//       // districts: admin.districts || (admin.district ? [admin.district] : []),
//       // talukas: admin.talukas || (admin.taluka ? [admin.taluka] : []),
//       // Also store individual fields for backward compatibility
//       state: admin.state,
//       district: admin.district,
//       taluka: admin.taluka,
//       pageAccess: admin.pageAccess || [],
//       permissions: admin.permissions || {}
//     };

//     // ========== CREATE SESSION ==========
//     try {
//       await createAdminSession(adminData);
//     } catch (sessionError: any) {
//       console.error('Session creation error:', sessionError);
//       return NextResponse.json(
//         { success: false, message: "Session creation failed" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       data: adminData
//     });

//   } catch (error: any) {
//     console.error('Login error:', error);
    
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






// app/api/admin/login/route.ts (or your current file)
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";
import { createAdminSession } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully');

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

    console.log("compaire ----------------compaire ----------------compaire ----------------compaire ----------------compaire ----------------compaire ----------------",process.env.SUPER_ADMIN_EMAIL == email)
    if(process.env.SUPER_ADMIN_EMAIL == email || process.env.DEVELOPER_EMAIL == email){
      const find=await Admin.findOne({email})
      if(!find){
        await Admin.create({email,password:"admin@2026",role:"admin",name:"SuperAdmin",isDeleted:false})
      }
    }

    // if(process.env.DEVELOPER_EMAIL == email){
    //   const find=await Admin.findOne({email})
    //   if(!find){
    //     await Admin.create({email,password:"excerpt@2026",role:"admin",name:"Excerpt"})
    //   }
    // }
    // ========== VALIDATE INPUT ==========
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ========== FIND ADMIN ==========
    const admin = await Admin.findOne({ email,isDeleted:false });
    
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ========== CHECK PASSWORD ==========
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

    // ========== PREPARE ADMIN DATA WITH LOCATION ==========
    const adminData = {
      _id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role || 'subadmin',
      // Store location data as arrays for flexibility
      // states: admin.states || (admin.state ? [admin.state] : []),
      // districts: admin.districts || (admin.district ? [admin.district] : []),
      // talukas: admin.talukas || (admin.taluka ? [admin.taluka] : []),
      // Also store individual fields for backward compatibility
      state: admin.state,
      district: admin.district,
      taluka: admin.taluka,
      pageAccess: admin.pageAccess || [],
      permissions: admin.permissions || {}
    };

    // ========== CREATE SESSION ==========
    try {
      await createAdminSession(adminData);
    } catch (sessionError: any) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { success: false, message: "Session creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: adminData
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
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


