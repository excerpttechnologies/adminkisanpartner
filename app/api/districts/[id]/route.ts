import connectDB from "@/app/lib/Db";
import District from "@/app/models/District";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET SINGLE DISTRICT
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const district = await District.findById(id);

  if (!district) {
    return NextResponse.json(
      {
        success: false,
        message: "District not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "District fetched successfully",
    data: district,
  });
}

/**
 * UPDATE DISTRICT
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const { name, stateId } = await req.json();

  const district = await District.findByIdAndUpdate(
    id,
    { name, stateId },
    { new: true }
  );

  if (!district) {
    return NextResponse.json(
      {
        success: false,
        message: "District not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "District updated successfully",
    data: district,
  });
}

/**
 * DELETE SINGLE DISTRICT
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const district = await District.findByIdAndDelete(id);

  if (!district) {
    return NextResponse.json(
      {
        success: false,
        message: "District not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "District deleted successfully",
  });
}
