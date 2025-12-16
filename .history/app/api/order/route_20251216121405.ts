import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const date = searchParams.get("date"); 

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const filter: any = {};

    /* 🔍 Search */
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "cropDetail.cropName": { $regex: search, $options: "i" } },
      ];
    }

    /* 📌 Status */
    if (status) {
      filter["status.admin"] = status;
    }

    /* 📅 SIMPLE DATE FILTER (ONE DAY ONLY) */
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }

    const total = await Order.countDocuments(filter);

    const data = await Order.find(filter)
      .populate("farmer", "name")
      .populate("trader", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received order data:", body);


    const order = await Order.create(body);

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Create failed",
        error: err.message 
      },
      { status: 400 }
    );
  }
}