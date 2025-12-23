import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Agent from "@/app/models/Agent";

/* ================= VIEW ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const {id}=await params
  const agent = await Agent.findById(id);

  if (!agent) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: agent });
}

/* ================= UPDATE / APPROVE / REJECT ================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await req.json();
const {id}=await params
  const updated = await Agent.findByIdAndUpdate(
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
  await connectDB();
  const {id}=await params
  await Agent.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
