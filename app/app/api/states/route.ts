// import connectDB from "@/app/lib/Db";
// import State from "@/app/models/State";
// import { NextRequest, NextResponse } from "next/server";


// /**
//  * GET STATES (Pagination + Search)
//  * /api/states?page=1&limit=10&search=del
//  */
// export async function GET(req: NextRequest) {
//   await connectDB();

//   const { searchParams } = new URL(req.url);
//   const page = Number(searchParams.get("page")) || 1;
//   const limit = Number(searchParams.get("limit")) || 10;
//   const search = searchParams.get("search") || "";

//   const query = search
//     ? { name: { $regex: search, $options: "i" } }
//     : {};

//   const skip = (page - 1) * limit;

//   const [states, total] = await Promise.all([
//     State.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
//     State.countDocuments(query),
//   ]);

//   return NextResponse.json({
//     success:true,
//     message:"success",   
//     data: states,
//     pagination: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//   });
// }

// /**
//  * CREATE STATE
//  */
// export async function POST(req: NextRequest) {
//   await connectDB();

//   const body = await req.json();
//   const { name } = body;

//   if (!name) {
//     return NextResponse.json(
//       {success:false,
//         message: "State name is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const state = await State.create({ name });
//     return NextResponse.json({
//       success:true,
//       message:"success",
//       state
//     }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success:false,
//          message: error.message },
//       { status: 400 }
//     );
//   }
// }

// /**
//  * BULK DELETE STATES
//  * body: { ids: string[] }
//  */
// export async function DELETE(req: NextRequest) {
//   await connectDB();

//   const body = await req.json();
//   const { ids } = body;

//   if (!Array.isArray(ids) || ids.length === 0) {
//     return NextResponse.json(
//       {
//         success:false,
//         message: "IDs array required" },
//       { status: 400 }
//     );
//   }

//   await State.deleteMany({ _id: { $in: ids } });

//   return NextResponse.json({
//        success:true,
//         message: "States deleted successfully" });
// }





import connectDB from "@/app/lib/Db";
import State from "@/app/models/State";
import { NextRequest, NextResponse } from "next/server";


/**
 * GET STATES (Pagination + Search)
 * /api/states?page=1&limit=10&search=del
 */
export async function GET(req: NextRequest) {
  await connectDB();

  const Allstates=await State.find({})

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || Number(Allstates.length > 0? Allstates.length : 10);
  const search = searchParams.get("search") || "";

  const query = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const skip = (page - 1) * limit;

  const [states, total] = await Promise.all([
    State.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    State.countDocuments(query),
  ]);

  return NextResponse.json({
    success:true,
    message:"success",   
    data: states,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/**
 * CREATE STATE
 */
export async function POST(req: NextRequest) {
  await connectDB();

  const { name } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { success: false, message: "State name is required" },
      { status: 400 }
    );
  }

  const normalizedName = name.trim().toLowerCase();

  // 🔒 Case-insensitive check
  const isExists = await State.findOne({ name: normalizedName });

  if (isExists) {
    return NextResponse.json(
      { success: false, message: "State name already exists" },
      { status: 409 }
    );
  }

  const state = await State.create({ name: normalizedName });

  return NextResponse.json(
    {
      success: true,
      message: "State created successfully",
      data: state,
    },
    { status: 201 }
  );
}



/**
 * BULK DELETE STATES
 * body: { ids: string[] }
 */
export async function DELETE(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const { ids } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      {
        success:false,
        message: "IDs array required" },
      { status: 400 }
    );
  }

  await State.deleteMany({ _id: { $in: ids } });

  return NextResponse.json({
       success:true,
        message: "States deleted successfully" });
}




