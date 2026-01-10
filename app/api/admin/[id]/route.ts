


// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Admin from "@/app/models/Admin";

// /* ================= VIEW ================= */
// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { id } = await params;
    
//     const admin = await Admin.findById(id).select("-password");

//     if (!admin) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Admin not found" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       data: admin 
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* ================= UPDATE ================= */
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { id } = await params;

//     // Convert pageAccess to lowercase before updating
//     const updateData = {
//       ...body,
//       ...(body.pageAccess && {
//         pageAccess: Array.isArray(body.pageAccess) 
//           ? body.pageAccess.map((module: string) => module.toLowerCase())
//           : [],
//       }),
//     };

//     const updated = await Admin.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     ).select("-password");

//     if (!updated) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Admin not found" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       data: updated 
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* ================= DELETE ================= */
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { id } = await params;
    
//     const deleted = await Admin.findByIdAndDelete(id);

//     if (!deleted) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Admin not found" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true,
//       message: "Admin deleted successfully"
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

















import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";
import bcrypt from 'bcryptjs';
/* ================= VIEW ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: admin 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= UPDATE ================= */
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { id } = await params;

//     // Convert pageAccess to lowercase before updating
//     const updateData = {
//       ...body,
//       ...(body.pageAccess && {
//         pageAccess: Array.isArray(body.pageAccess) 
//           ? body.pageAccess.map((module: string) => module.toLowerCase())
//           : [],
//       }),
//     };

//     const updated = await Admin.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     ).select("-password");

//     if (!updated) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Admin not found" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       data: updated 
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = await params;

    // Process the update data
    const updateData: any = {
      ...body,
    };

    // Hash password only if it exists in the request body
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateData.password = hashedPassword;
    }

    // Convert pageAccess to lowercase before updating
    if (body.pageAccess) {
      updateData.pageAccess = Array.isArray(body.pageAccess) 
        ? body.pageAccess.map((module: string) => module.toLowerCase())
        : [];
    }

    // Remove password from the updateData if we're not updating it
    // This prevents accidentally clearing the password when not provided
    if (!body.password && updateData.password) {
      delete updateData.password;
    }

    const updated = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updated) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updated 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= SOFT DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Instead of deleting, mark as deleted (soft delete)
    const deleted = await Admin.findByIdAndUpdate(
      id,
      { 
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: "admin" // You can get this from session
      },
      { new: true }
    );

    if (!deleted) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Admin moved to trash successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= RESTORE ADMIN ================= */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Restore the admin (soft delete reversal)
    const restored = await Admin.findByIdAndUpdate(
      id,
      { 
        isDeleted: false,
        deletedAt: null,
        deletedBy: null
      },
      { new: true }
    ).select("-password");

    if (!restored) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Admin restored successfully",
      data: restored
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}