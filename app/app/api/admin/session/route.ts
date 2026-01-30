import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    
    if (!session || !session.admin) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session.admin
    });
  } catch (error: any) {
   
    return NextResponse.json(
      { success: false, message: error.message || "Session check failed" },
      { status: 500 }
    );
  }
}