import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Farmer from "@/app/models/Farmer";

/* ================= VIEW ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
     const {id}=await params
  await connectDB();
  const farmer = await Farmer.findById(id);

  if (!farmer) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: farmer });
}

/* ================= UPDATE / APPROVE ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
     const {id}=await params
  await connectDB();
  const body = await req.json();

  const updated = await Farmer.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

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
    const {id}=await params
    console.log(id)
  await connectDB();
  await Farmer.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
