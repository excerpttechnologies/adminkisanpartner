import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // pending | completed
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder: 1 | -1 =
      searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    /* ------------------ MATCH FILTER ------------------ */
    const match: Record<string, any> = {};

    if (status === "completed") {
      match.transporterStatus = "completed";
    } else if (status === "pending") {
      match.transporterStatus = { $ne: "completed" };
    }

    if (search) {
      match.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
        { traderName: { $regex: search, $options: "i" } },
      ];
    }

    /* ------------------ SORT FIX ------------------ */
    const sortStage: Record<string, 1 | -1> = {
      [sortBy]: sortOrder,
    };

    /* ------------------ AGGREGATION PIPELINE ------------------ */
    const pipeline: PipelineStage[] = [
      { $match: match },

      {
        $project: {
          _id: 0,
          orderId: 1,
          farmerId: 1,
          farmerName: 1,
          traderId: 1,
          traderName: 1,
          transporterStatus: 1,

          transporterDetails: {
            transporterName: 1,
            vehicleNumber: 1,
            driverName: 1,
            transporterReached: 1,
            goodsConditionCorrect: 1,
            quantityCorrect: 1,
            verifiedByName: 1,
            verifiedAt: 1,
          },

          createdAt: 1,
        },
      },

      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await Order.aggregate(pipeline);
    const totalCount = await Order.countDocuments(match);

    return NextResponse.json({
      success: true,
      page,
      limit,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    console.error("Shipment Report Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch shipment report" },
      { status: 500 }
    );
  }
}
