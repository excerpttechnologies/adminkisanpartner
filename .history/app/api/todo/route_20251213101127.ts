import connectDb from "@/app/_utils/Db";
import { NextResponse } from "next/server";

export async function GET() {
   connectDb()

  return NextResponse.json({
    success: true,
    message: "success",
  });
}

export 
