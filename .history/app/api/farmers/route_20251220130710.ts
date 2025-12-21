import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Farmer from "@/app/models/Farmer";

/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const farmer = await Farmer.create(body);

    return NextResponse.json({ success: true, data: farmer });
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
    const district=searchParams.get("district") || ""

    const filter: any = {};


    if (search) {
  filter.$or = [
    { "personalInfo.name": { $regex: search, $options: "i" } },
    { "personalInfo.mobile": { $regex: search, $options: "i" } },
    { "personalInfo.email": { $regex: search, $options: "i" } },
    { "personalInfo.district": { $regex: search, $options: "i" } },
  ];
}

  if(district){
      filter.$
  }

    const total = await Farmer.countDocuments(filter);

    const data = await Farmer.find(filter).select("personalInfo")
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
