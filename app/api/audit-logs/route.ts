



// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import AuditLog from "@/app/models/AuditLog";
// import { getAdminSession } from "@/app/lib/auth";
// import mongoose from "mongoose";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();

//     // ❌ Only SUPER ADMIN allowed
//     if (!session || session.admin.role !== "admin") {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(req.url);
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 0;

//     const logs = await AuditLog.find({actorRole:"subadmin"})
//       .populate("actorId", "name role")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const total = await AuditLog.countDocuments();

//     return NextResponse.json({
//       success: true,
//       data: logs,
//       page,
//       total,
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create new audit log
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();

//     // Check if user is authenticated (admin or subadmin can create logs)
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();

//     // Required fields validation
//     const requiredFields = ['action', 'module', 'description'];
//     const missingFields = requiredFields.filter(field => !body[field]);

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: `Missing required fields: ${missingFields.join(', ')}` 
//         },
//         { status: 400 }
//       );
//     }

//     // Validate actorRole if provided (must be either admin or subadmin)
//     if (body.actorRole && !['admin', 'subadmin'].includes(body.actorRole)) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: "Invalid actorRole. Must be 'admin' or 'subadmin'" 
//         },
//         { status: 400 }
//       );
//     }

//     // Create audit log with session user data if not provided in body
//     const auditLogData = {
//       actorId: body.actorId || session.admin._id,
//       actorRole: body.actorRole || session.admin.role,
//       action: body.action,
//       module: body.module,
//       targetId: body.targetId || null,
//       description: body.description,
//       changes: body.changes || {},
//       ipAddress: body.ipAddress || req.headers.get('x-forwarded-for') || 'unknown',
//       userAgent: body.userAgent || req.headers.get('user-agent') || 'unknown'
//     };

//     // Validate ObjectId format for actorId and targetId
//     if (!mongoose.Types.ObjectId.isValid(auditLogData.actorId)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid actorId format" },
//         { status: 400 }
//       );
//     }

//     if (auditLogData.targetId && !mongoose.Types.ObjectId.isValid(auditLogData.targetId)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid targetId format" },
//         { status: 400 }
//       );
//     }

//     // Convert string IDs to ObjectId
//     if (typeof auditLogData.actorId === 'string') {
//       auditLogData.actorId = new mongoose.Types.ObjectId(auditLogData.actorId);
//     }

//     if (auditLogData.targetId && typeof auditLogData.targetId === 'string') {
//       auditLogData.targetId = new mongoose.Types.ObjectId(auditLogData.targetId);
//     }

//     const auditLog = await AuditLog.create(auditLogData);

//     return NextResponse.json({
//       success: true,
//       message: "Audit log created successfully",
//       data: auditLog
//     }, { status: 201 });

//   } catch (err: any) {
//     console.error("Error creating audit log:", err);
    
//     // Handle duplicate key errors
//     if (err.code === 11000) {
//       return NextResponse.json(
//         { success: false, message: "Duplicate audit log entry" },
//         { status: 400 }
//       );
//     }

//     // Handle validation errors
//     if (err.name === 'ValidationError') {
//       const errors = Object.values(err.errors).map((error: any) => error.message);
//       return NextResponse.json(
//         { success: false, message: "Validation error", errors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: err.message || "Failed to create audit log" },
//       { status: 500 }
//     );
//   }
// }









import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import AuditLog from "@/app/models/AuditLog";
import "@/app/models/Admin"; // ✅ REQUIRED
import { getAdminSession } from "@/app/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await getAdminSession();

    if (!session || session.admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const logs = await AuditLog.find({actorRole:"subadmin"})
      .populate("actorId", "name role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    return NextResponse.json({
      success: true,
      data: logs,
      page,
      total,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// POST - Create new audit log
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getAdminSession();

    // Check if user is authenticated (admin or subadmin can create logs)
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Required fields validation
    const requiredFields = ['action', 'module', 'description'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate actorRole if provided (must be either admin or subadmin)
    if (body.actorRole && !['admin', 'subadmin'].includes(body.actorRole)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid actorRole. Must be 'admin' or 'subadmin'" 
        },
        { status: 400 }
      );
    }

    // Create audit log with session user data if not provided in body
    const auditLogData = {
      actorId: body.actorId || session.admin._id,
      actorRole: body.actorRole || session.admin.role,
      action: body.action,
      module: body.module,
      targetId: body.targetId || null,
      description: body.description,
      changes: body.changes || {},
      ipAddress: body.ipAddress || req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: body.userAgent || req.headers.get('user-agent') || 'unknown'
    };

    // Validate ObjectId format for actorId and targetId
    if (!mongoose.Types.ObjectId.isValid(auditLogData.actorId)) {
      return NextResponse.json(
        { success: false, message: "Invalid actorId format" },
        { status: 400 }
      );
    }

    if (auditLogData.targetId && !mongoose.Types.ObjectId.isValid(auditLogData.targetId)) {
      return NextResponse.json(
        { success: false, message: "Invalid targetId format" },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectId
    if (typeof auditLogData.actorId === 'string') {
      auditLogData.actorId = new mongoose.Types.ObjectId(auditLogData.actorId);
    }

    if (auditLogData.targetId && typeof auditLogData.targetId === 'string') {
      auditLogData.targetId = new mongoose.Types.ObjectId(auditLogData.targetId);
    }

    const auditLog = await AuditLog.create(auditLogData);

    return NextResponse.json({
      success: true,
      message: "Audit log created successfully",
      data: auditLog
    }, { status: 201 });

  } catch (err: any) {
    console.error("Error creating audit log:", err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate audit log entry" },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error: any) => error.message);
      return NextResponse.json(
        { success: false, message: "Validation error", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message || "Failed to create audit log" },
      { status: 500 }
    );
  }
}

// DELETE - Delete audit log(s)
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const session = await getAdminSession();

    // ❌ Only SUPER ADMIN allowed to delete logs
    if (!session || session.admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Only admin can delete logs." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { logId, logIds, deleteAll } = body;

    // Validate input
    if (!logId && !logIds && !deleteAll) {
      return NextResponse.json(
        { success: false, message: "Please provide logId, logIds, or set deleteAll to true" },
        { status: 400 }
      );
    }

    let deletedCount = 0;

    if (deleteAll) {
      // Delete all audit logs (admin-only operation)
      const result = await AuditLog.deleteMany({});
      deletedCount = result.deletedCount;
      
      return NextResponse.json({
        success: true,
        message: `Successfully deleted all ${deletedCount} audit logs`,
        deletedCount
      });
    } else if (logIds && Array.isArray(logIds)) {
      // Delete multiple logs
      // Validate all IDs
      const invalidIds = logIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        return NextResponse.json(
          { success: false, message: `Invalid log IDs: ${invalidIds.join(', ')}` },
          { status: 400 }
        );
      }

      const result = await AuditLog.deleteMany({ _id: { $in: logIds } });
      deletedCount = result.deletedCount;
      
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${deletedCount} audit log(s)`,
        deletedCount
      });
    } else if (logId) {
      // Delete single log
      if (!mongoose.Types.ObjectId.isValid(logId)) {
        return NextResponse.json(
          { success: false, message: "Invalid log ID format" },
          { status: 400 }
        );
      }

      const deletedLog = await AuditLog.findByIdAndDelete(logId);
      
      if (!deletedLog) {
        return NextResponse.json(
          { success: false, message: "Audit log not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Audit log deleted successfully",
        deletedLog
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );

  } catch (err: any) {
    console.error("Error deleting audit log:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete audit log" },
      { status: 500 }
    );
  }
}