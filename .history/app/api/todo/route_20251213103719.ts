import connectDb from "@/app/_utils/Db";
import Todo from "@/app/schema/todo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const todos = await Todo.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: todos },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();

    const { todo } = await req.json();

    if (!todo || !todo.trim()) {
      return NextResponse.json(
        { success: false, message: "Todo is required" },
        { status: 400 }
      );
    }

    const newTodo = await Todo.create({ todo });

    return NextResponse.json(
      { success: true, data: newTodo },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create todo" },
      { status: 500 }
    );
  }
}
