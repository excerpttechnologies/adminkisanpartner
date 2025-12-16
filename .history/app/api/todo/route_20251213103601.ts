import connectDb from "@/app/_utils/Db";
import Todo from "@/app/schema/todo";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb()
   const todo=await Todo.find({})
  return NextResponse.json({
    success: true,
    message: "success",
    todo
  });
}

export async function POST(req:Request){
   await connectDb()

    const {todo}=await req.json()

    cons

    await Todo.create({todo})

     return NextResponse.json({
    success: true,
    message: "success",
  });

}
