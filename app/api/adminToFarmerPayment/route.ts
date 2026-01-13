
import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // 🔢 Query params
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const order: 1 | -1 = searchParams.get("order") === "asc" ? 1 : -1;
    const paymentStatus = searchParams.get("paymentStatus") ?? "";
    const paymentMethod = searchParams.get("paymentMethod") ?? "";
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";

    const skip = (page - 1) * limit;

    // 🔥 Build match conditions dynamically
    const matchConditions: any = {
      adminToFarmerPayment: { $exists: true }
    };

    // Search condition
    if (search) {
      matchConditions.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
      ];
    }

    // Payment status condition
    if (paymentStatus) {
      matchConditions["adminToFarmerPayment.paymentStatus"] = paymentStatus;
    }

    // Date range condition
    const dateConditions: any = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateConditions.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateConditions.$lte = end;
    }
    if (startDate || endDate) {
      matchConditions.createdAt = dateConditions;
    }

    // 🔥 AGGREGATION PIPELINE
    const pipeline: PipelineStage[] = [
      // 1️⃣ Only orders having adminToFarmerPayment with filters
      {
        $match: matchConditions,
      },

      // 2️⃣ Unwind paymentHistory (for report rows)
      {
        $unwind: {
          path: "$adminToFarmerPayment.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 3️⃣ Filter by payment method if specified
      ...(paymentMethod ? [
        {
          $match: {
            "adminToFarmerPayment.paymentHistory.paymentMethod": paymentMethod
          }
        }
      ] : []),

      // 4️⃣ Project required fields only
      {
        $project: {
          _id: 0,
          orderId: 1,
          farmerId: 1,
          farmerName: 1,
          createdAt: 1,

          totalAmount: "$adminToFarmerPayment.totalAmount",
          paidAmount: "$adminToFarmerPayment.paidAmount",
          remainingAmount: "$adminToFarmerPayment.remainingAmount",
          paymentStatus: "$adminToFarmerPayment.paymentStatus",

          paymentAmount: "$adminToFarmerPayment.paymentHistory.amount",
          paymentMethod: "$adminToFarmerPayment.paymentHistory.paymentMethod",
          paidDate: "$adminToFarmerPayment.paymentHistory.paidDate",
        },
      },

      // 5️⃣ Sort
      {
        $sort: {
          [sortBy]: order,
        } as Record<string, 1 | -1>,
      },

      // 6️⃣ Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    // For counting total records (without pagination)
    const countPipeline: PipelineStage[] = [
      {
        $match: matchConditions,
      },
      {
        $unwind: {
          path: "$adminToFarmerPayment.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(paymentMethod ? [
        {
          $match: {
            "adminToFarmerPayment.paymentHistory.paymentMethod": paymentMethod
          }
        }
      ] : []),
      { $count: "total" },
    ];

    // Execute both pipelines in parallel for better performance
    const [data, totalResult] = await Promise.all([
      Order.aggregate(pipeline),
      Order.aggregate(countPipeline),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    console.error("Farmer Payments Report Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}