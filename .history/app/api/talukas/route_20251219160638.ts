// import { NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import {Taluka} from "@/app/models/Taluka";

// /* ================= GET ================= */
// export async function GET(req: Request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search");
//     const districtId = searchParams.get("districtId");

//     const filter: Record<string, unknown> = {};

//     if (districtId) {
//       filter.districtId = districtId;
//     }

//     if (search) {
//       filter.name = { $regex: search, $options: "i" };
//     }

//     const talukas = await Taluka.find(filter)
//       .populate({
//         path: "districtId",
//         select: "name stateId",
//         populate: {
//           path: "stateId",
//           select: "name",
//         },
//       })
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, talukas });
//   } catch (error: unknown) {
//     const message =
//       error instanceof Error ? error.message : "Internal Server Error";

//     return NextResponse.json(
//       { success: false, message },
//       { status: 500 }
//     );
//   }
// }

// /* ================= POST ================= */
// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const { name, districtId } = await req.json();

//     if (!name || !districtId) {
//       return NextResponse.json(
//         { message: "Taluka name and District are required" },
//         { status: 400 }
//       );
//     }

//     const taluka = await Taluka.create({ name, districtId });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Taluka added successfully",
//         taluka,
//       },
//       { status: 201 }
//     );
//   } catch (error: unknown) {
//     if (
//       typeof error === "object" &&
//       error !== null &&
//       "code" in error &&
//       (error as { code: number }).code === 11000
//     ) {
//       return NextResponse.json(
//         { message: "Taluka already exists in this district" },
//         { status: 409 }
//       );
//     }

//     const message =
//       error instanceof Error ? error.message : "Internal Server Error";

//     return NextResponse.json(
//       { success: false, message },
//       { status: 500 }
//     );
//   }
// }
