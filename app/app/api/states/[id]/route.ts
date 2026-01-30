// import connectDB from "@/app/lib/Db";
// import State from "@/app/models/State";
// import { NextRequest, NextResponse } from "next/server";


// /**
//  * UPDATE STATE
//  */
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const {id}=await params

//   const { name } = await req.json();

//   const state = await State.findByIdAndUpdate(
//     id,
//     { name },
//     { new: true }
//   );

//   if (!state) {
//     return NextResponse.json(
//       { message: "State not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({
//     success:true,
//     state,
//     message:"state update success"
//   });
// }

// /**
//  * DELETE SINGLE STATE
//  */
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const {id}=await params

//   const state = await State.findByIdAndDelete(id);

//   if (!state) {
//     return NextResponse.json(
//       {
//        success:false,
//         message: "State not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({ 
//        success:true,
//        message: "State deleted successfully" });
// }

// export async function GET(
//        req: NextRequest,
//        { params }: { params: Promise<{ id: string }> }
//      ) {
//        await connectDB();
//        const {id}=await params
     
//        const state = await State.findById(id);
     
//        if (!state) {
//          return NextResponse.json(
//            { 
//               success:false,
//               message: "State not found" },
//            { status: 404 }
//          );
//        }
     
//        return NextResponse.json({
//               success:true,
//               data:state,
//                message: "State get successfully" });
//      }
     












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
  const { id } = await params;

  const { name } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { success: false, message: "State name is required" },
      { status: 400 }
    );
  }

  const normalizedName = name.trim().toLowerCase();

  const isExists = await State.findOne({
    name: normalizedName,
    _id: { $ne: id },
  });

  if (isExists) {
    return NextResponse.json(
      { success: false, message: "State name already exists" },
      { status: 409 }
    );
  }

  const state = await State.findByIdAndUpdate(
    id,
    { name: normalizedName },
    { new: true }
  );

  if (!state) {
    return NextResponse.json(
      { success: false, message: "State not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "State updated successfully",
    data: state,
  });
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
     
