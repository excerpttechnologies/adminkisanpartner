import connectDb from "@/app/_utils/Db";
import Todo from "@/app/schema/todo";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{ params: { id: string } }){
    await connectDb()

    await Todo.findByIdAndDelete(params.id)

     return NextResponse.json({
    success: true,
    message: "success",
  });

}

export async function PUT(req:Request,{params}:{ params: { id: string } }){
   await connectDb()

    const {todo}=await req.json()

    await Todo.findByIdAndUpdate(params.id,{todo},{ new: true, runValidators: true })

     return NextResponse.json({
    success: true,
    message: "success",
  });

}
