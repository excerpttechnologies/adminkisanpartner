import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";

/* ================= UPDATE ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Posting.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: < }
) {
  try {
    await connectDB();

    const {id}=await params

    await Posting.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
