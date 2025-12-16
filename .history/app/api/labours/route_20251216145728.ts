import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Labour from "@/app/models/Labours";


/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
   console.log
    const labour = await Labour.create(body);

    return NextResponse.json({
      success: true,
      data: labour,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Create failed" },
      { status: 500 }
    );
  }
}

/* ================= GET (LIST) ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { "farmer.name": { $regex: search, $options: "i" } },
        { crop: { $regex: search, $options: "i" } },
        { work: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Labour.countDocuments(filter);

    const data = await Labour.find(filter)
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
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 }
    );
  }
}
