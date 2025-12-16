import connectDB from "@/app/lib/Db";
import Requirement from "@/app/models/Requirement";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    /* ================= QUERY PARAMS ================= */
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");          // Active / Inactive
    const category = searchParams.get("category");      // Seeds
    const subCategory = searchParams.get("subCategory"); // pumpkin
    

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    /* ================= FILTER OBJECT ================= */
    const filter: any = {};

    // 🔍 Global Search
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { variety: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Status
    if (status) {
      filter.status = status;
    }

    // ✅ Category
    if (category) {
      filter.category = category;
    }

    // ✅ SubCategory
    if (subCategory) {
      filter.subCategory = subCategory;
    }

    // ✅ Grade filter (inside qualities array)
    if (grade) {
      filter["qualities.grade"] = grade;
    }

    // ✅ Date Range Filter
    if (fromDate || toDate) {
      filter.requirementDate = {};
      if (fromDate) filter.requirementDate.$gte = new Date(fromDate);
      if (toDate) filter.requirementDate.$lte = new Date(toDate);
    }

    /* ================= DB QUERY ================= */
    const total = await Requirement.countDocuments(filter);

    const data = await Requirement.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      data,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
