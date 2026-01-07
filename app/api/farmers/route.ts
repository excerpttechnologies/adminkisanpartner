



// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Farmer from "@/app/models/Farmer";
// import bcrypt from "bcryptjs";

// /* ================= CREATE ================= */

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const mobileNo = body.personalInfo?.mobileNo;
//     if(mobileNo.length > 10 || mobileNo.length < 10){
//       return NextResponse.json(
//         { success: false, message: "Mobile number must be 10 digits" },
//         { status: 400 }
//       );
//     }
//     const role = body.role || "farmer";
//     /* ================= VALIDATION ================= */
//     if (!mobileNo) {
//       return NextResponse.json(
//         { success: false, message: "Mobile number is required" },
//         { status: 400 }
//       );
//     }

//     /* ================= CHECK EXISTING MOBILE ================= */
//     const existingUser = await Farmer.findOne({
//       "personalInfo.mobileNo": mobileNo,
//       role
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Mobile number already exists",
//         },
//         { status: 409 } // Conflict
//       );
//     }

//     /* ================= HASH SECURITY ================= */
//     const hashedPassword = body.security?.password
//       ? await bcrypt.hash(body.security.password, 10)
//       : "";

//     const hashedMpin = body.security?.mpin
//       ? await bcrypt.hash(body.security.mpin, 10)
//       : "";

//     /* ================= CREATE FARMER DATA ================= */
//     const farmerData = {
//       personalInfo: {
//         name: body.personalInfo?.name,
//         mobileNo,
//         email: body.personalInfo?.email,
//         address: body.personalInfo?.address,
//         villageGramaPanchayat:
//           body.personalInfo?.villageGramaPanchayat,
//         post: body.personalInfo?.post,
//         pincode: body.personalInfo?.pincode,
//         taluk: body.personalInfo?.taluk,
//         district: body.personalInfo?.district,
//         state: body.personalInfo?.state,
//       },

//       commodities: body.commodities || [],
//       nearestMarkets: body.nearestMarkets || [],

//       bankDetails: {
//         accountHolderName:
//           body.bankDetails?.accountHolderName,
//         accountNumber:
//           body.bankDetails?.accountNumber,
//         ifscCode:
//           body.bankDetails?.ifscCode,
//         branch:
//           body.bankDetails?.branch,
//       },

//       security: {
//         referralCode:
//           body.security?.referralCode || "",
//         mpin: hashedMpin,
//         password: hashedPassword,
//       },

//       role: body.role || "farmer",
//       isActive: body.isActive ?? true,
//       registeredAt: new Date(),

//       ...(body.role === "farmer" && {
//         farmLocation: body.farmLocation || {},
//       }),
//     };

//     const farmer = await Farmer.create(farmerData);

//     return NextResponse.json({
//       success: true,
//       data: farmer,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }



// // export async function GET(req: NextRequest) {
// //   try {
// //     await connectDB();

// //     const { searchParams } = new URL(req.url);
// //     const search = searchParams.get("search") || "";
// //     const page = Number(searchParams.get("page")) || 1;
// //     const limit = Number(searchParams.get("limit")) || 10;
// //     const district = searchParams.get("district") || "";
// //     const role = searchParams.get("role");

// //     // Start with an empty filter object
// //     const filter: any = {};

// //     // Build the $or conditions array
// //     const orConditions = [];
   
// //     if (search) {
// //       orConditions.push(
// //         { "personalInfo.name": { $regex: search, $options: "i" } },
// //         { "personalInfo.mobileNo": { $regex: search, $options: "i" } },
// //         { "personalInfo.email": { $regex: search, $options: "i" } },
// //         { "personalInfo.district": { $regex: search, $options: "i" } },
// //         { "personalInfo.state": { $regex: search, $options: "i" } }
// //       );
// //     }

// //     if (district) {
// //       orConditions.push(
// //         { "personalInfo.district": { $regex: district, $options: "i" } }
// //       );
// //     }

// //     // Only add $or to filter if we have any conditions
// //     if (orConditions.length > 0) {
// //       filter.$or = orConditions;
// //     }

// //     // Add role filter only if role is provided
// //     if (role) {
// //       filter.role = role;
// //     }
// //    // console.log(role)
// //     const total = await Farmer.countDocuments(filter);
// //     // await Farmer.updateMany(
// //     //   { registrationStatus: { $exists: false } },
// //     //   { $set: { registrationStatus: "approved" } }
// //     // );

// //     const data = await Farmer.find(filter)
// //       .sort({ createdAt: -1 })
// //       .skip((page - 1) * limit)
// //       .limit(limit);

// //     return NextResponse.json({
// //       success: true,
// //       page,
// //       limit,
// //       total,
// //       data,
// //     });
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { success: false, message: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;
//     const district = searchParams.get("district") || "";
//     const role = searchParams.get("role");
//     const registrationStatus = searchParams.get("registrationStatus") || ""; // Add registrationStatus parameter

//     // Start with an empty filter object
//     const filter: any = {};

//     // Build the $or conditions array
//     const orConditions = [];
   
//     if (search) {
//       orConditions.push(
//         { "personalInfo.name": { $regex: search, $options: "i" } },
//         { "personalInfo.mobileNo": { $regex: search, $options: "i" } },
//         { "personalInfo.email": { $regex: search, $options: "i" } },
//         { "personalInfo.district": { $regex: search, $options: "i" } },
//         { "personalInfo.state": { $regex: search, $options: "i" } },
//         { "personalInfo.villageGramaPanchayat": { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } }
//       );
//     }

//     ///farmerId
//     if (district) {
//       filter["personalInfo.district"] = { $regex: district, $options: "i" };
//     }

//     // Add registrationStatus filter if provided
//     if (registrationStatus) {
//       filter.registrationStatus = registrationStatus;
//     }

//     // Only add $or to filter if we have any conditions
//     if (orConditions.length > 0) {
//       filter.$or = orConditions;
//     }

//     // Add role filter only if role is provided
//     if (role) {
//       filter.role = role;
//     }

//     // Set default registrationStatus for existing records
//     // await Farmer.updateMany(
//     //   { registrationStatus: { $exists: false } },
//     //   { $set: { registrationStatus: "pending" } } // Changed to "pending" as default
//     // );

//     const total = await Farmer.countDocuments(filter);
//     const data = await Farmer.find(filter)
//       .sort({ registeredAt: -1 })
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
import Farmer from "@/app/models/Farmer";
import bcrypt from "bcryptjs";

/* ================= CREATE ================= */

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const mobileNo = body.personalInfo?.mobileNo;
//     if(mobileNo.length > 10 || mobileNo.length < 10){
//       return NextResponse.json(
//         { success: false, message: "Mobile number must be 10 digits" },
//         { status: 400 }
//       );
//     }
//     const role = body.role || "farmer";
//     /* ================= VALIDATION ================= */
//     if (!mobileNo) {
//       return NextResponse.json(
//         { success: false, message: "Mobile number is required" },
//         { status: 400 }
//       );
//     }

//     /* ================= CHECK EXISTING MOBILE ================= */
//     const existingUser = await Farmer.findOne({
//       "personalInfo.mobileNo": mobileNo,
//       role
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Mobile number already exists",
//         },
//         { status: 409 } // Conflict
//       );
//     }

//     /* ================= HASH SECURITY ================= */
//     const hashedPassword = body.security?.password
//       ? await bcrypt.hash(body.security.password, 10)
//       : "";

//     const hashedMpin = body.security?.mpin
//       ? await bcrypt.hash(body.security.mpin, 10)
//       : "";

//     /* ================= CREATE FARMER DATA ================= */
//     const farmerData = {
//       personalInfo: {
//         name: body.personalInfo?.name,
//         mobileNo,
//         email: body.personalInfo?.email,
//         address: body.personalInfo?.address,
//         villageGramaPanchayat:
//           body.personalInfo?.villageGramaPanchayat,
//         post: body.personalInfo?.post,
//         pincode: body.personalInfo?.pincode,
//         taluk: body.personalInfo?.taluk,
//         district: body.personalInfo?.district,
//         state: body.personalInfo?.state,
//       },

//       commodities: body.commodities || [],
//       nearestMarkets: body.nearestMarkets || [],

//       bankDetails: {
//         accountHolderName:
//           body.bankDetails?.accountHolderName,
//         accountNumber:
//           body.bankDetails?.accountNumber,
//         ifscCode:
//           body.bankDetails?.ifscCode,
//         branch:
//           body.bankDetails?.branch,
//       },

//       security: {
//         referralCode:
//           body.security?.referralCode || "",
//         mpin: hashedMpin,
//         password: hashedPassword,
//       },

//       role: body.role || "farmer",
//       isActive: body.isActive ?? true,
//       registeredAt: new Date(),

//       ...(body.role === "farmer" && {
//         farmLocation: body.farmLocation || {},
//       }),
//     };

//     const farmer = await Farmer.create(farmerData);

//     return NextResponse.json({
//       success: true,
//       data: farmer,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    /* ================= MOBILE VALIDATION ================= */
    const mobileNo = body.personalInfo?.mobileNo;

    if (!mobileNo) {
      return NextResponse.json(
        { success: false, message: "Mobile number is required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number must be exactly 10 digits",
        },
        { status: 400 }
      );
    }

    const role = body.role || "farmer";

    /* ================= DUPLICATE MOBILE CHECK ================= */
    const existingUser = await Farmer.findOne({
      "personalInfo.mobileNo": mobileNo,
      role,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number already exists",
        },
        { status: 409 }
      );
    }

    /* ================= MPIN VALIDATION (FIXED) ================= */
    const rawMpin = body.security?.mpin;
    let mpin: string | undefined;

    if (rawMpin !== undefined) {
      if (typeof rawMpin === "number") {
        mpin = rawMpin.toString();
      } else if (typeof rawMpin === "string") {
        mpin = rawMpin.trim();
      } else {
        return NextResponse.json(
          { success: false, message: "MPIN must be a 4-digit number" },
          { status: 400 }
        );
      }

      if (!/^\d{4}$/.test(mpin)) {
        return NextResponse.json(
          {
            success: false,
            message: "MPIN must be exactly 4 digits Number",
          },
          { status: 400 }
        );
      }
    }

    /* ================= PASSWORD VALIDATION ================= */
    if (body.security?.password && body.security.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    /* ================= HASHING ================= */
    const hashedPassword = body.security?.password
      ? await bcrypt.hash(body.security.password, 10)
      : "";

    const hashedMpin = mpin
      ? await bcrypt.hash(mpin, 10)
      : "";

    /* ================= CREATE FARMER DATA ================= */
    const farmerData = {
      personalInfo: {
        name: body.personalInfo?.name,
        mobileNo,
        email: body.personalInfo?.email,
        address: body.personalInfo?.address,
        villageGramaPanchayat: body.personalInfo?.villageGramaPanchayat,
        post: body.personalInfo?.post,
        pincode: body.personalInfo?.pincode,
        taluk: body.personalInfo?.taluk,
        district: body.personalInfo?.district,
        state: body.personalInfo?.state,
      },

      commodities: body.commodities || [],
      nearestMarkets: body.nearestMarkets || [],

      bankDetails: {
        accountHolderName: body.bankDetails?.accountHolderName,
        accountNumber: body.bankDetails?.accountNumber,
        ifscCode: body.bankDetails?.ifscCode,
        branch: body.bankDetails?.branch,
      },

      security: {
        referralCode: body.security?.referralCode || "",
        mpin: hashedMpin,
        password: hashedPassword,
      },

      role,
      isActive: body.isActive ?? true,
      registeredAt: new Date(),

      ...(role === "farmer" && {
        farmLocation: body.farmLocation || {},
      }),
    };

    /* ================= SAVE ================= */
    const farmer = await Farmer.create(farmerData);

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data: farmer,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}





export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const district = searchParams.get("district") || "";
    const role = searchParams.get("role");
    const registrationStatus = searchParams.get("registrationStatus") || ""; // Add registrationStatus parameter

    // Start with an empty filter object
    const filter: any = {};

    // Build the $or conditions array
    const orConditions = [];
   
    if (search) {
      orConditions.push(
        { "personalInfo.name": { $regex: search, $options: "i" } },
        { "personalInfo.mobileNo": { $regex: search, $options: "i" } },
        { "personalInfo.email": { $regex: search, $options: "i" } },
        { "personalInfo.district": { $regex: search, $options: "i" } },
        { "personalInfo.state": { $regex: search, $options: "i" } },
        { "personalInfo.villageGramaPanchayat": { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } }
      );
    }

    ///farmerId
    if (district) {
      filter["personalInfo.district"] = { $regex: district, $options: "i" };
    }

    // Add registrationStatus filter if provided
    if (registrationStatus) {
      filter.registrationStatus = registrationStatus;
    }

    // Only add $or to filter if we have any conditions
    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    // Add role filter only if role is provided
    if (role) {
      filter.role = role;
    }

    // Set default registrationStatus for existing records
    // await Farmer.updateMany(
    //   { registrationStatus: { $exists: false } },
    //   { $set: { registrationStatus: "pending" } } // Changed to "pending" as default
    // );

    const total = await Farmer.countDocuments(filter);
    const data = await Farmer.find(filter)
      .sort({ registeredAt: -1 })
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