import connectDb from "@/app/_utils/Db";
import Todo from "@/app/schema/todo";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
   const {id}=await params
  

    const deletedTodo = await Todo.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Todo deleted",deletedTodo },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

     const {id}=await params

    const { todo } = await req.json();

    if (!todo || !todo.trim()) {
      return NextResponse.json(
        { success: false, message: "Todo is required" },
        { status: 400 }
      );
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { todo },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}
