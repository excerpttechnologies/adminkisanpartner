import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Tracking from "@/app/models/Tracking";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    let data;


    if (id) {
      data = await Tracking.findById(id).lean();
      if (!data) {
        return NextResponse.json(
          { success: false, message: "Tracking not found" },
          { status: 404 }
        );
      }
    } else {
      data = await Tracking.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 }
    );
  }
}