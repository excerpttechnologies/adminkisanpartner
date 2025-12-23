import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";

/* ================= VIEW ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
 const {id}=await params
  const admin = await Admin.findById(id).select("-password");

  if (!admin) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: admin });
}

/* ================= UPDATE ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await req.json();
const {id}=await params
  const updated = await Admin.findByIdAndUpdate(
    id,
    body,
    { new: true }
  ).select("-password");

  if (!updated) {
    return NextResponse.json({ success: false }, { status: 404 });
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
  await Admin.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
