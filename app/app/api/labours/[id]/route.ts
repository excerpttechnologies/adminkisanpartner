import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Labour from "@/app/models/Labours";
import mongoose from "mongoose";

/* ================= UPDATE ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = await params;

    /* -------- VALIDATE ID -------- */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid labour ID" },
        { status: 400 }
      );
    }

    /* -------- VALIDATE MALE / FEMALE -------- */
    if (
      body.maleRequirement !== undefined &&
      body.maleRequirement < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Male requirement cannot be negative" },
        { status: 400 }
      );
    }

    if (
      body.femaleRequirement !== undefined &&
      body.femaleRequirement < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Female requirement cannot be negative" },
        { status: 400 }
      );
    }

    /* -------- UPDATE -------- */
    const updated = await Labour.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Labour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Labour updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    /* -------- VALIDATE ID -------- */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid labour ID" },
        { status: 400 }
      );
    }

    const deleted = await Labour.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Labour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Labour deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
