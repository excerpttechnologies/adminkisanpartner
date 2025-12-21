import connectDB from "@/app/lib/Db";
import State from "@/app/models/State";
import { NextRequest, NextResponse } from "next/server";


/**
 * UPDATE STATE
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const {id}=await params

  const { name } = await req.json();

  const state = await State.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  if (!state) {
    return NextResponse.json(
      { message: "State not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(state);
}

/**
 * DELETE SINGLE STATE
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const {id}=await params

  const state = await State.findByIdAndDelete(id);

  if (!state) {
    return NextResponse.json(
      {
       success:false,
        message: "State not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ 
       success:true,
       message: "State deleted successfully" });
}

export async function GET(
       req: NextRequest,
       { params }: { params: Promise<{ id: string }> }
     ) {
       await connectDB();
       const {id}=await params
     
       const state = await State.findById(id);
     
       if (!state) {
         return NextResponse.json(
           { 
              success:false,
              message: "State not found" },
           { status: 404 }
         );
       }
     
       return NextResponse.json({
              success:true,
              data:state,
               message: "State get successfully" });
     }
     
