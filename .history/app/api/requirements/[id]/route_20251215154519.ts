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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const id=await par

    console.log(id,body)

    const updated = await Requirement.findByIdAndUpdate(
     params.id,
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
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 400 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deleted = await Requirement.findByIdAndDelete(params.id);

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
