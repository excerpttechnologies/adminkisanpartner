// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Agent from "@/app/models/Agent";

// /* ================= VIEW ================= */
// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const {id}=await params
//   const agent = await Agent.findById(id);

//   if (!agent) {
//     return NextResponse.json({ success: false }, { status: 404 });
//   }

//   return NextResponse.json({ success: true, data: agent });
// }

// /* ================= UPDATE / APPROVE / REJECT ================= */
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const body = await req.json();
// const {id}=await params
//   const updated = await Agent.findByIdAndUpdate(
//     id,
//     body,
//     { new: true }
//   );

//   if (!updated) {
//     return NextResponse.json({ success: false }, { status: 404 });
//   }

//   return NextResponse.json({ success: true, data: updated });
// }

// /* ================= DELETE ================= */
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const {id}=await params
//   await Agent.findByIdAndDelete(id);

//   return NextResponse.json({ success: true });
// }



import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Agent from "@/app/models/Agent";
import { getAdminSession } from "@/app/lib/auth";
import { createAuditLog, getChanges } from "@/app/_utils/auditLogger";

/* ================= VIEW ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const agent = await Agent.findById(id);

    if (!agent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: agent });
  } catch (error: any) {
    console.error("Agent view error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= UPDATE / APPROVE / REJECT ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const body = await req.json();
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get old agent data for comparison
    const oldAgent = await Agent.findById(id).lean();

    if (!oldAgent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    // Check if mobile is being updated and validate uniqueness
    if (body.mobile && body.mobile !== oldAgent.mobile) {
      if (!/^\d{10}$/.test(body.mobile)) {
        return NextResponse.json(
          { success: false, message: "Mobile number must be exactly 10 digits" },
          { status: 400 }
        );
      }

      const existingAgent = await Agent.findOne({
        mobile: body.mobile,
        _id: { $ne: id },
      });

      if (existingAgent) {
        return NextResponse.json(
          { success: false, message: "Mobile number already exists" },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData = { ...body };
    
    // Remove _id if present in body
    delete updateData._id;
    delete updateData.agentId; // Agent ID shouldn't be changed

    // Calculate changes BEFORE update
    const changes = getChanges(oldAgent, updateData);

    const updated = await Agent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    // Create audit log if there are changes
    if (Object.keys(changes).length > 0) {
      try {
        let action = "UPDATE_AGENT";
        let description = `Agent ${updated.agentId || updated.name} updated by ${session.admin.name}`;
        
        // Special handling for status changes
        if (body.status && body.status !== oldAgent.status) {
          if (body.status === "active") {
            action = "APPROVE_AGENT";
            description = `Agent ${updated.agentId || updated.name} approved by ${session.admin.name}`;
          } else if (body.status === "inactive") {
            action = "REJECT_AGENT";
            description = `Agent ${updated.agentId || updated.name} rejected by ${session.admin.name}`;
          }
        }

        await createAuditLog({
          request: req,
          actorId: session.admin._id,
          actorRole: session.admin.role,
          action,
          module: "Agents",
          targetId: updated._id,
          description,
          changes: Object.keys(changes).length > 0 ? changes : undefined,
        });
      } catch (err) {
        console.error("AUDIT LOG FAILED (UPDATE AGENT):", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: Object.keys(changes).length > 0 ? "Agent updated successfully" : "No changes made",
      data: updated,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });
  } catch (error: any) {
    console.error("Agent update error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get agent details before deletion for audit log
    const deletedAgent = await Agent.findByIdAndDelete(id);

    if (!deletedAgent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    // Audit log for deletion
    try {
      await createAuditLog({
        request: req,
        actorId: session.admin._id,
        actorRole: session.admin.role,
        action: "DELETE_AGENT",
        module: "Agents",
        targetId: deletedAgent._id,
        description: `Agent ${deletedAgent.agentId || deletedAgent.name} deleted by ${session.admin.name}`,
      });
    } catch (err) {
      console.error("AUDIT LOG FAILED (DELETE AGENT):", err);
    }

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error: any) {
    console.error("Agent delete error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}