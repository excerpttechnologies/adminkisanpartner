import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";
import Agent from "@/app/models/Agent";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    const result = await Agent.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} agent deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { success: false, message: "Bulk delete failed", error: error.message },
      { status: 500 }
    );
  }
}