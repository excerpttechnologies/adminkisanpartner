import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Labour from "@/app/models/Labours";

/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      villageName,
      contactNumber,
      email,
      workTypes,
      experience,
      availability,
      address,
      maleRequirement,
      femaleRequirement,
      isActive,
    } = body;

    /* -------- VALIDATION -------- */
    if (!name || !contactNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and contact number are required",
        },
        { status: 400 }
      );
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    if (
      maleRequirement < 0 ||
      femaleRequirement < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Male/Female requirement cannot be negative",
        },
        { status: 400 }
      );
    }
   
    /* -------- CREATE -------- */
    const labour = await Labour.create({
      name,
      villageName,
      contactNumber,
      email,
      workTypes: Array.isArray(workTypes) ? workTypes : [],
      experience,
      availability,
      address,
      maleRequirement: maleRequirement || 0,
      femaleRequirement: femaleRequirement || 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({
      success: true,
      message: "Labour created successfully",
      data: labour,
    });
  } catch (error) {
    console.error(error);
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
    const skip = (page - 1) * limit;

    const filter: any = {};

    /* -------- SEARCH FILTER -------- */
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { villageName: { $regex: search, $options: "i" } },
        { contactNumber: { $regex: search, $options: "i" } },
        { workTypes: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const total = await Labour.countDocuments(filter);

    const data = await Labour.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 }
    );
  }
}
