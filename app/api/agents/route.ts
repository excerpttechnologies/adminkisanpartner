




// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Agent from "@/app/models/Agent";


// /* ================= CREATE ================= */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const agent = await Agent.create(body);

//     return NextResponse.json({ success: true, data: agent });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* ================= LIST ================= */
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

    // const { searchParams } = new URL(req.url);
    // const search = searchParams.get("search") || "";
    // const page = Number(searchParams.get("page")) || 1;
    // const limit = Number(searchParams.get("limit")) || 10;
    // const status = searchParams.get("status") || ""
    // const filter: any = {};

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { mobile: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     if(status){
//       filter.status=status
//     }
//     const total = await Agent.countDocuments(filter);

//     const data = await Agent.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data,
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
import Agent from "@/app/models/Agent";
import { getAdminSession } from "@/app/lib/auth";
import { createAuditLog, getChanges } from "@/app/_utils/auditLogger";

/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getAdminSession();
    const body = await req.json();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!body.name || !body.mobile) {
      return NextResponse.json(
        { success: false, message: "Name and mobile are required" },
        { status: 400 }
      );
    }

    // Check for duplicate mobile
    const existingAgent = await Agent.findOne({ mobile: body.mobile });
    if (existingAgent) {
      return NextResponse.json(
        { success: false, message: "Mobile number already exists" },
        { status: 409 }
      );
    }

    // Generate agent ID
    const lastAgent = await Agent.findOne().sort({ agentId: -1 });
    let nextNumber = 1;
    if (lastAgent && lastAgent.agentId) {
      const lastNumber = parseInt(lastAgent.agentId.replace('AGT-', ''));
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    const agentId = `AGT-${nextNumber.toString().padStart(3, '0')}`;
    body.agentId = agentId;

    const agent = await Agent.create(body);

    // Audit log for creation
    try {
      await createAuditLog({
        request: req,
        actorId: session.admin._id,
        actorRole: session.admin.role,
        action: "CREATE_AGENT",
        module: "Agents",
        targetId: "dhhdhhd",
        description: `Agent ${agentId} (${body.name}) created by ${session.admin.name}`,
      });
    } catch (err) {
      console.error("AUDIT LOG FAILED (CREATE AGENT):", err);
    }

    return NextResponse.json({ 
      success: true, 
      data: agent,
      message: "Agent created successfully"
    });
  } catch (error: any) {
    console.error("Agent creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= LIST ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") || "";
    
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { agentId: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }
    
    const total = await Agent.countDocuments(filter);

    const data = await Agent.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data,
    });
  } catch (error: any) {
    console.error("Agent list error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}