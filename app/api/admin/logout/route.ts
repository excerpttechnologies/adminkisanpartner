import { NextRequest, NextResponse } from "next/server";
import { deleteAdminSession } from "@/app/lib/auth";

export async function POST() {
  try {
    await deleteAdminSession();
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Logout failed" },
      { status: 500 }
    );
  }
}