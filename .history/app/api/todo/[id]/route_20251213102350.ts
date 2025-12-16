import connectDb from "@/app/_utils/Db";
import Todo from "@/app/schema/todo";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{ params: { id: string } }){
    connectDb()

    await Todo.findByIdAndDelete(params.id)

     return NextResponse.json({
    success: true,
    message: "success",
  });

}

export async function PUT(req:Request,{params}:{ params: { id: string } }){
    connectDb()

    await Todo.findByIdAndUpdate(params.)

     return NextResponse.json({
    success: true,
    message: "success",
  });

}
