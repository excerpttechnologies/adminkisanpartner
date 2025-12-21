import connectDB from "@/app/lib/Db";
import District from "@/app/models/District";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET DISTRICTS (stateId required)
 * /api/districts?stateId=xxx&page=1&limit=10&search=nash
 */
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const stateId = searchParams.get("stateId") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  if (!stateId) {
    return NextResponse.json(
      {
        success: false,
        message: "stateId is required",
      },
      { status: 400 }
    );
  }

  const skip = (page - 1) * limit;

  const query: any = {  };

  if(stateId){
    query.stateId=stateId
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const [districts, total] = await Promise.all([
    District.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    District.countDocuments(query),
  ]);

  return NextResponse.json({
    success: true,
    message: "Districts fetched successfully",
    data: districts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/**
 * CREATE DISTRICT
 */
export async function POST(req: NextRequest) {
  await connectDB();

  const { name, stateId } = await req.json();

  if (!name || !stateId) {
    return NextResponse.json(
      {
        success: false,
        message: "District name and stateId are required",
      },
      { status: 400 }
    );
  }

  const district = await District.create({ name, stateId });

  return NextResponse.json(
    {
      success: true,
      message: "District created successfully",
      data: district,
    },
    { status: 201 }
  );
}

/**
 * BULK DELETE DISTRICTS
 */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "IDs array is required",
      },
      { status: 400 }
    );
  }

  await District.deleteMany({ _id: { $in: ids } });

  return NextResponse.json({
    success: true,
    message: "Selected districts deleted successfully",
  });
}
