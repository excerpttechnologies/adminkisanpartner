import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Agent from "@/app/models/Agent";

/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const agent = await Agent.create(body);

    return NextResponse.json({ success: true, data: agent });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= LIST ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const status = searchParams.get("")
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Agent.countDocuments(filter);

    const data = await Agent.find(filter)
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
