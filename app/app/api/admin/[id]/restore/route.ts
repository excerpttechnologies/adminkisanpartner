import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Restore the admin
    const restored = await Admin.findByIdAndUpdate(
      id,
      { 
        isDeleted: false,
        deletedAt: null,
        deletedBy: null
      },
      { new: true }
    ).select("-password");

    if (!restored) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Admin restored successfully",
      data: restored
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}