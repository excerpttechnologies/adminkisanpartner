import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";

/* UPDATE */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const updated = await Order.findByIdAndUpdate(id, body, { new: true });

  if (!updated) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}

/* DELETE */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  await Order.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
