// // app/api/b2b-re-fund/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/app/lib/Db";
// import B2BRefund from "@/app/models/B2BRefund";

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     const searchParams = request.nextUrl.searchParams;
//     const refundId = searchParams.get("refundId");
//     const orderId = searchParams.get("orderId");
//     const status = searchParams.get("status");
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
    
//     let query: any = {};
    
//     if (refundId) query.refundId = refundId;
//     if (orderId) query.orderId = orderId;
//     if (status) query.status = status;
    
//     const skip = (page - 1) * limit;
    
//     const [refunds, total] = await Promise.all([
//       B2BRefund.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       B2BRefund.countDocuments(query),
//     ]);
    
//     return NextResponse.json({
//       success: true,
//       data: refunds,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching refunds:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch refunds" },
//       { status: 500 }
//     );
//   }
// }

// // Optional: Get single refund by ID
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
//     const body = await request.json();
//     const { refundId } = body;
    
//     const refund = await B2BRefund.findOne({ refundId }).lean();
    
//     return NextResponse.json({
//       success: true,
//       data: refund,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch refund" },
//       { status: 500 }
//     );
//   }
// }














// app/api/b2b-re-fund/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/Db";
import B2BRefund from "@/app/models/B2BRefund";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const refundId = searchParams.get("refundId")?.trim();
    const orderId = searchParams.get("orderId")?.trim();
    const status = searchParams.get("status")?.trim();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = {};

    // Use case-insensitive partial match for text fields
    if (refundId) query.refundId = { $regex: refundId, $options: "i" };
    if (orderId) query.orderId = { $regex: orderId, $options: "i" };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [refunds, total] = await Promise.all([
      B2BRefund.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      B2BRefund.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: refunds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching B2B refunds:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch refunds",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Optional: Get single refund by ID
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { refundId } = body;

    const refund = await B2BRefund.findOne({ refundId }).lean();

    return NextResponse.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    console.error("Error fetching single B2B refund:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch refund",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}