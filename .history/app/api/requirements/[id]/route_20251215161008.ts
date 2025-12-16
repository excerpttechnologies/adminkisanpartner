import connectDB from "@/app/lib/Db";
import Requirement from "@/app/models/Requirement";
import { NextRequest, NextResponse } from "next/server";

/* ================= GET BY ID ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const requirement = await Requirement.findById(params.id);

    if (!requirement) {
      return NextResponse.json(
        { success: false, message: "Requirement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: requirement,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID" },
      { status: 400 }
    );
  }
}


/* ================= UPDATE ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // 🔥 IMPORTANT: await params
    const { id } = await params;

    const body = await req.json();

    console.log("ID:", id);
    console.log("BODY:", body);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID missing" },
        { status: 400 }
      );
    }

    const updated = await Requirement.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Requirement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Requirement updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const deleted = await Requirement.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Requirement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Requirement deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 400 }
    );
  }
}
