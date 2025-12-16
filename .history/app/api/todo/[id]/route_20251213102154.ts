import connectDb from "@/app/_utils/Db";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{ params: { id: string } }){
    connectDb()

     return NextResponse.json({
    success: true,
    message: "success",
  });

}

export async function PUT(){
    connectDb()

     return NextResponse.json({
    success: true,
    message: "success",
  });

}
