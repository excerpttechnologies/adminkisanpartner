






// import connectDB from "@/app/lib/Db";
// import Labour from "@/app/models/Labours";
// import { NextRequest, NextResponse } from "next/server";


// /* ================= CREATE ================= */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const {
//       name,
//       villageName,
//       contactNumber,
//       email,
//       workTypes,
//       experience,
//       availability,
//       address,
//       maleRequirement,
//       femaleRequirement,
//       isActive,
//       state,
//       district,
//       taluku,
//     } = body;

//     /* -------- VALIDATION -------- */
//     if (!name || !contactNumber) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Name and contact number are required",
//         },
//         { status: 400 }
//       );
//     }

//     if (email && !/^\S+@\S+\.\S+$/.test(email)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid email format",
//         },
//         { status: 400 }
//       );
//     }

//     if (
//       maleRequirement < 0 ||
//       femaleRequirement < 0
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Male/Female requirement cannot be negative",
//         },
//         { status: 400 }
//       );
//     }
   
//     /* -------- CREATE -------- */
//     const labour = await Labour.create({
//       name,
//       villageName,
//       contactNumber,
//       email,
//       workTypes: Array.isArray(workTypes) ? workTypes : [],
//       experience,
//       availability,
//       address,
//       maleRequirement: maleRequirement || 0,
//       femaleRequirement: femaleRequirement || 0,
//       isActive: isActive ?? true,
//        state,
//       district,
//       taluku,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Labour created successfully",
//       data: labour,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Create failed" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= GET (LIST) ================= */
// // export async function GET(req: NextRequest) {
// //   try {
// //     await connectDB();

// //     const { searchParams } = new URL(req.url);

// //     const search = searchParams.get("search") || "";
// //     const page = Number(searchParams.get("page")) || 1;
// //     const limit = Number(searchParams.get("limit")) || 10;
// //     const skip = (page - 1) * limit;

// //     const filter: any = {};

// //     /* -------- SEARCH FILTER -------- */
// //     if (search) {
// //       filter.$or = [
// //         { name: { $regex: search, $options: "i" } },
// //         { villageName: { $regex: search, $options: "i" } },
// //         { contactNumber: { $regex: search, $options: "i" } },
// //         { workTypes: { $in: [new RegExp(search, "i")] } },
// //       ];
// //     }

// //     const total = await Labour.countDocuments(filter);

// //     const data = await Labour.find(filter)
// //       .sort({ createdAt: -1 })
// //       .skip(skip)
// //       .limit(limit)
// //       .lean();

// //     return NextResponse.json({
// //       success: true,
// //       page,
// //       limit,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //       data,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.json(
// //       { success: false, message: "Fetch failed" },
// //       { status: 500 }
// //     );
// //   }
// // }




// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const search = searchParams.get("search") || "";
//     const taluk = searchParams.get("taluk") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     const filter: any = {};

//     /* -------- TALUK FILTER -------- */
//     let talukFilterApplied = false;
//     if (taluk && taluk !== "All") {
//       talukFilterApplied = true;
//     }

//     /* -------- SEARCH FILTER -------- */
//     if (search) {
//       const searchConditions = [
//         { name: { $regex: search, $options: "i" } },
//         { villageName: { $regex: search, $options: "i" } },
//         { contactNumber: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { district: { $regex: search, $options: "i" } },
//         { state: { $regex: search, $options: "i" } },
//         { "workTypes": { $in: [new RegExp(search, "i")] } }
//       ];

//       // If taluk filter exists, combine with AND
//       if (talukFilterApplied) {
//         filter.$and = [
//           { taluku: { $regex: new RegExp(`^${taluk}$`, "i") } },
//           { $or: searchConditions }
//         ];
//       } else {
//         filter.$or = searchConditions;
//       }
//     } else if (talukFilterApplied) {
//       // Only taluk filter, no search
//       filter.taluku = { $regex: new RegExp(`^${taluk}$`, "i") };
//     }

//     console.log("Filter being applied:", JSON.stringify(filter, null, 2));
//     console.log("Search:", search, "Taluk:", taluk);

//     // Get total count with filters
//     const total = await Labour.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     // Get data with pagination
//     const data = await Labour.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Return response in exact format you showed
//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages,
//       data
//     });

//   } catch (error) {
//     console.error("Error fetching labours:", error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Fetch failed",
//         error: error instanceof Error ? error.message : "Unknown error"
//       },
//       { status: 500 }
//     );
//   }
// }



import connectDB from "@/app/lib/Db";
import Labour from "@/app/models/Labours";
import { NextRequest, NextResponse } from "next/server";

/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      villageName,
      contactNumber,
      email,
      workTypes,
      experience,
      availability,
      address,
      maleRequirement,
      femaleRequirement,
      isActive,
      state,
      district,
      taluku,
    } = body;

    /* -------- BASIC VALIDATION -------- */
   if (!name || !contactNumber || !email || !state || !district || !taluku || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, contact number, email, state, district, taluku, and address are required",
        },
        { status: 400 }
      );
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    if (maleRequirement < 0 || femaleRequirement < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Male/Female requirement cannot be negative",
        },
        { status: 400 }
      );
    }

    /* -------- DUPLICATE VALIDATION (NEW) -------- */
    if (contactNumber) {
      const existingPhone = await Labour.findOne({ contactNumber });
      if (existingPhone) {
        return NextResponse.json(
          {
            success: false,
            message: "Contact number already exists",
          },
          { status: 409 }
        );
      }
    }

    if (email) {
      const existingEmail = await Labour.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          { status: 409 }
        );
      }
    }

    /* -------- CREATE -------- */
    const labour = await Labour.create({
      name,
      villageName,
      contactNumber,
      email,
      workTypes: Array.isArray(workTypes) ? workTypes : [],
      experience,
      availability,
      address,
      maleRequirement: maleRequirement || 0,
      femaleRequirement: femaleRequirement || 0,
      isActive: isActive ?? true,
      state,
      district,
      taluku,
    });

    return NextResponse.json({
      success: true,
      message: "Labour created successfully",
      data: labour,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Create failed" },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const taluk = searchParams.get("taluk") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    /* -------- TALUK FILTER -------- */
    let talukFilterApplied = false;
    if (taluk && taluk !== "All") {
      talukFilterApplied = true;
    }

    /* -------- SEARCH FILTER -------- */
    if (search) {
      const searchConditions = [
        { name: { $regex: search, $options: "i" } },
        { villageName: { $regex: search, $options: "i" } },
        { contactNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { "workTypes": { $in: [new RegExp(search, "i")] } }
      ];

      // If taluk filter exists, combine with AND
      if (talukFilterApplied) {
        filter.$and = [
          { taluku: { $regex: new RegExp(`^${taluk}$`, "i") } },
          { $or: searchConditions }
        ];
      } else {
        filter.$or = searchConditions;
      }
    } else if (talukFilterApplied) {
      // Only taluk filter, no search
      filter.taluku = { $regex: new RegExp(`^${taluk}$`, "i") };
    }

    console.log("Filter being applied:", JSON.stringify(filter, null, 2));
    console.log("Search:", search, "Taluk:", taluk);

    // Get total count with filters
    const total = await Labour.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get data with pagination
    const data = await Labour.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Return response in exact format you showed
    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      data
    });

  } catch (error) {
    console.error("Error fetching labours:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Fetch failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}