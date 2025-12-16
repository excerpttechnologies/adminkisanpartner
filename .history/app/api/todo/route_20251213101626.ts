import connectDb from "@/app/_utils/Db";
import Todo from "@/app/schema/todo";
import { NextResponse } from "next/server";

export async function GET() {
   connectDb()
  Todo
  return NextResponse.json({
    success: true,
    message: "success",
  });
}

export async function POST(){
    connectDb()

     return NextResponse.json({
    success: true,
    message: "success",
  });

}

export async function DELETE(){
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
