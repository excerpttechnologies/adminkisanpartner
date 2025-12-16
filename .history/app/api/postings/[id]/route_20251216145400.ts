import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";

/* ================= VIEW ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const posting = await Posting.findById(params.id);

  if (!posting) {
    return NextResponse.json(
      { success: false, message: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: posting });
}

/* ================= UPDATE ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await req.json();
const {id}=await params
  const updated = await Posting.findByIdAndUpdate(
    id,
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
}

/* ================= DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const {id}=await params

  await Posting.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
