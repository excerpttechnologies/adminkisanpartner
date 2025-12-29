import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";

/* ========== VIEW ========== */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  const order = await Order.findById(id);

  if (!order) {
    return NextResponse.json(
      { success: false, message: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: order });
}

/* ========== UPDATE ========== */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await req.json();
  const { id } = await params;

  const updated = await Order.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json(
      { success: false, message: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: updated });
}

/* ========== DELETE ========== */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  await Order.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
