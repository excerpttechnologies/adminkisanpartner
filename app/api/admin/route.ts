



// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Admin from "@/app/models/Admin";

// /* ================= CREATE ADMIN ================= */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     // Convert pageAccess to lowercase before saving
//     const pageAccess = Array.isArray(body.pageAccess) 
//       ? body.pageAccess.map((module: string) => module.toLowerCase())
//       : [];

//     // Always add "dashboard" to pageAccess if not already included
//     if (!pageAccess.includes("dashboard")) {
//       pageAccess.push("dashboard");
//     }

//     const adminData = {
//       ...body,
//       pageAccess,
//     };

//     const admin = await Admin.create(adminData);

//     return NextResponse.json({
//       success: true,
//       data: admin,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* ================= LIST ADMINS ================= */
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;

//     const filter: any = {};

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     const total = await Admin.countDocuments(filter);

//     const data = await Admin.find(filter)
//       .select("-password") // 🚫 hide password
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }



















import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Admin from "@/app/models/Admin";

/* ================= CREATE ADMIN ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Convert pageAccess to lowercase before saving
    const pageAccess = Array.isArray(body.pageAccess) 
      ? body.pageAccess.map((module: string) => module.toLowerCase())
      : [];

    // Always add "dashboard" to pageAccess if not already included
    if (!pageAccess.includes("dashboard")) {
      pageAccess.push("dashboard");
    }

    const adminData = {
      ...body,
      pageAccess,
    };

    const admin = await Admin.create(adminData);

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= LIST ADMINS ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
        const showDeleted = searchParams.get("showDeleted") === "true"; // New parameter


    const filter: any = {};

     if (!showDeleted) {
      filter.isDeleted = { $ne: true };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Admin.countDocuments(filter);

    const data = await Admin.find(filter)
      .select("-password") // 🚫 hide password
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
