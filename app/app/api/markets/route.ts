import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Market from "@/app/models/Market";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const markets = await Market.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Markets fetched successfully",
        data: markets
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Markets Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}
