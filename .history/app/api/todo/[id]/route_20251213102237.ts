import connectDb from "@/app/_utils/Db";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{ params: { id: string } }){
    connectDb()

    await To

     return NextResponse.json({
    success: true,
    message: "success",
  });

}

export async function PUT(req:Request,{params}:{ params: { id: string } }){
    connectDb()

     return NextResponse.json({
    success: true,
    message: "success",
  });

}
