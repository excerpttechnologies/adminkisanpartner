// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Farmer from "@/app/models/Farmer";

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

//     const result = await Farmer.deleteMany({ _id: { $in: ids } });

//     return NextResponse.json({
//       success: true,
//       message: `${result.deletedCount} farmer deleted successfully`,
//     });
//   } catch (error: any) {
//     console.error("Error in bulk delete:", error);
//     return NextResponse.json(
//       { success: false, message: "Bulk delete failed", error: error.message },
//       { status: 500 }
//     );
//   }
// }








//UPDATED BY SAGAR


// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Farmer from "@/app/models/Farmer";
// import { getAdminSession } from "@/app/lib/auth";
// import { createAuditLog } from "@/app/_utils/auditLogger";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();

//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { ids } = await req.json();

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No IDs provided" },
//         { status: 400 }
//       );
//     }

//     const farmersToDelete = await Farmer.find(
//       { _id: { $in: ids } },
//       { farmerId: 1 }
//     );

//     const result = await Farmer.deleteMany({ _id: { $in: ids } });

//     if (result.deletedCount && result.deletedCount > 0) {
//       try {
//         await createAuditLog({
//           request: req,
//           actorId: session.admin._id,
//           actorRole: session.admin.role,
//           action: "BULK_DELETE_FARMER",
//           module: "Farmers",
//           description: `${result.deletedCount} farmers deleted by ${session.admin.name}`,
//         });
//       } catch (err) {
//         console.error("AUDIT LOG FAILED (BULK DELETE):", err);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: `${result.deletedCount} farmer deleted successfully`,
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
import Farmer from "@/app/models/Farmer";
import { getAdminSession } from "@/app/lib/auth";
import { createAuditLog } from "@/app/_utils/auditLogger";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    const farmersToDelete = await Farmer.find(
      { _id: { $in: ids } },
      { farmerId: 1 }
    );

    const result:any = await Farmer.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount && result.deletedCount > 0) {

       const data:{
        role:string;
        farmerId:string;
        traderId:string;
      }=result;
      try {
        await createAuditLog({
          request: req,
          actorId: session.admin._id,
          actorRole: session.admin.role,
          action: "BULK_DELETE_"+ `${data.role=="farmer"?"FARMER":"TRADER"}`,
          module: `${data.role=="farmer"?"Farmer":"Trader"}`,
          description: `${result.deletedCount}${data.role=="farmer"?"Farmer":"Trader"} deleted ${session.admin.name}`,
        });
      } catch (err) {
        console.error("AUDIT LOG FAILED (BULK DELETE):", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} farmer deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { success: false, message: "Bulk delete failed", error: error.message },
      { status: 500 }
    );
  }
}
