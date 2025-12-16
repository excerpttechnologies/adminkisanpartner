import { NextResponse } from "next/server";

export async function GET() {
   await conn
  return NextResponse.json({
    success: true,
    message: "success",
  });
}
