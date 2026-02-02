// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Posting from "@/app/models/Posting";
// import Agent from "@/app/models/Agent";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { ids } = await req.json();

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No IDs provided" },
//         { status: 400 }
//       );
//     }

//     const result = await Agent.deleteMany({ _id: { $in: ids } });

//     return NextResponse.json({
//       success: true,
//       message: `${result.deletedCount} agent deleted successfully`,
//     });
//   } catch (error: any) {
//     console.error("Error in bulk delete:", error);
//     return NextResponse.json(
//       { success: false, message: "Bulk delete failed", error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";
import Agent from "@/app/models/Agent";
import { getAdminSession } from "@/app/lib/auth";
import { createAuditLog } from "@/app/_utils/auditLogger";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getAdminSession();
    const { ids } = await req.json();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    // Get agents before deletion for audit log
    const agentsToDelete = await Agent.find(
      { _id: { $in: ids } },
      { name: 1, mobile: 1, agentId: 1 }
    );

    const result = await Agent.deleteMany({ _id: { $in: ids } });

    // Audit log for bulk deletion
    if (result.deletedCount && result.deletedCount > 0) {
      try {
        const agentNames = agentsToDelete
          .map(agent => agent.name || `Agent ${agent.agentId || agent._id}`)
          .join(", ");
        
        await createAuditLog({
          request: req,
          actorId: session.admin._id,
          actorRole: session.admin.role,
          action: "BULK_DELETE_AGENT",
          module: "Agents",
          description: `${result.deletedCount} agents deleted by ${session.admin.name}. Agents: ${agentNames.substring(0, 200)}${agentNames.length > 200 ? '...' : ''}`,
        });
      } catch (err) {
        console.error("AUDIT LOG FAILED (BULK DELETE AGENT):", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} agent(s) deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { success: false, message: "Bulk delete failed", error: error.message },
      { status: 500 }
    );
  }
}