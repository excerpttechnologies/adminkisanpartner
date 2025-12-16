import connectDB from "@/app/lib/Db";
import Requirement from "@/app/models/Requirement";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    /* ================= QUERY PARAMS ================= */
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");     // Pending | Approved
    const category = searchParams.get("category"); // Fruits | Vegetables
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    /* ================= FILTER OBJECT ================= */
    const filter: any = {};

    // 🔍 Search (title, item, postedBy name)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { item: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Status Filter
    if (status) {
      filter.status = status;
    }

    // ✅ Category Filter
    if (category) {
      filter.category = category;
    }

    /* ================= DB QUERY ================= */
    const total = await Requirement.countDocuments(filter);

    const requirements = await Requirement.find(filter)
      .populate("postedBy", "name mobile") // user reference
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      data: requirements,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
