import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";

/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const crop = await Posting.create(body);

    return NextResponse.json({ success: true, data: crop });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Create failed" },
      { status: 500 }
    );
  }
}

/* ================= GET (LIST) ================= */
/* ================= GET (LIST with SEARCH) ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const farmingType = searchParams.get("farmingType") || "";
    const seedType = searchParams.get("seedType") || "";

    const filter: any = {};

    if (search) {
      filter.$or = [
        { farmingType: { $regex: search, $options: "i" } },
        { seedType: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
        { trackingId: { $regex: search, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$acres" },
              regex: search,
            },
          },
        },
      ];
    }

    // Add farming type filter if provided
    if (farmingType) {
      filter.farmingType = farmingType;
    }

    // Add seed type filter if provided
    if (seedType) {
      filter.seedType = seedType;
    }

    const total = await Posting.countDocuments(filter);

    const data = await Posting.find(filter)
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
  } catch (error) {
    console.error("Error fetching crops:", error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 }
    );
  }
}