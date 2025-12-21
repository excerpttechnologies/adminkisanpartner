import { NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import {Taluka} from "@/app/models/Taluka";

/* ================= PUT ================= */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { name, districtId } = await req.json();

    if (!name || !districtId) {
      return NextResponse.json(
        { message: "Taluka name and District are required" },
        { status: 400 }
      );
    }

    const taluka = await Taluka.findByIdAndUpdate(
      params.id,
      { name, districtId },
      { new: true, runValidators: true }
    );

    if (!taluka) {
      return NextResponse.json(
        { message: "Taluka not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Taluka updated successfully",
      taluka,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const taluka = await Taluka.findByIdAndDelete(params.id);

    if (!taluka) {
      return NextResponse.json(
        { message: "Taluka not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Taluka deleted successfully",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
