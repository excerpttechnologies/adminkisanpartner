import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Permanent delete (hard delete)
    const deleted = await Admin.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Admin permanently deleted successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}