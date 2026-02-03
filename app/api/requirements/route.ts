// import connectDB from "@/app/lib/Db";
// import Requirement from "@/app/models/Requirement";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     /* ================= QUERY PARAMS ================= */
//     const search = searchParams.get("search") || "";
//     const status = searchParams.get("status");          // Active / Inactive
//     const category = searchParams.get("category");      // Seeds
  
    

//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;

//     /* ================= FILTER OBJECT ================= */
//     const filter: any = {};

//     // 🔍 Global Search
//     if (search) {
//       filter.$or = [
//         { category: { $regex: search, $options: "i" } },
//         { subCategory: { $regex: search, $options: "i" } },
//         { variety: { $regex: search, $options: "i" } },
//         { location: { $regex: search, $options: "i" } },
//       ];
//     }

//     // ✅ Status
//     if (status) {
//       filter.status = status;
//     }

//     // ✅ Category
//     if (category) {
//       filter.category = category;
//     }

//     /* ================= DB QUERY ================= */
//     const total = await Requirement.countDocuments(filter);

//     const data = await Requirement.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     /* ================= RESPONSE ================= */
//     return NextResponse.json({
//       success: true,
//       total,
//       page,
//       limit,
//       data,
//     });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= POST (CREATE) ================= */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const requirement = await Requirement.create(body);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Requirement created successfully",
//         data: requirement,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to create requirement" },
//       { status: 400 }
//     );
//   }
// }




// import connectDB from "@/app/lib/Db";
// import Requirement from "@/app/models/Requirement";
// import { NextRequest, NextResponse } from "next/server";
// import Farmer from "@/app/models/Farmer";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     /* ================= QUERY PARAMS ================= */
//     const search = searchParams.get("search") || "";
//     const status = searchParams.get("status");          // Active / Inactive
//     const category = searchParams.get("category");      // Seeds
//     const taluk = searchParams.get("taluk");           // New: Taluk filter
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;

//     /* ================= FILTER OBJECT ================= */
//     const filter: any = {};

//     // 🔍 Global Search
//     if (search) {
//       filter.$or = [
//         { category: { $regex: search, $options: "i" } },
//         { subCategory: { $regex: search, $options: "i" } },
//         { variety: { $regex: search, $options: "i" } },
//         { location: { $regex: search, $options: "i" } },
//       ];
//     }

//     // ✅ Status
//     if (status) {
//       filter.status = status;
//     }

//     // ✅ Category
//     if (category) {
//       filter.category = category;
//     }

//     // ✅ Taluk (New filter)
//     if (taluk) {
//       // First, find all farmers/traders in this taluk
//       const usersInTaluk = await Farmer.find({
//         $or: [
//           { "personalInfo.taluk": { $regex: taluk, $options: "i" } },
//           { taluk: { $regex: taluk, $options: "i" } } // For backward compatibility
//         ]
//       }).select("traderId farmerId");

//       // Extract user IDs
//       const userIds = usersInTaluk.map(user => user.traderId || user.farmerId);
      
//       // Filter requirements by postedBy in these user IDs
//       if (userIds.length > 0) {
//         filter.postedBy = { $in: userIds };
//       } else {
//         // If no users found in taluk, return empty results
//         return NextResponse.json({
//           success: true,
//           total: 0,
//           page,
//           limit,
//           data: [],
//           message: "No requirements found for this taluk"
//         });
//       }
//     }

//     /* ================= DB QUERY ================= */
//     const total = await Requirement.countDocuments(filter);

//     // Fetch requirements with user details populated
//     const data = await Requirement.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     // Populate user details for each requirement
//     const populatedData = await Promise.all(
//       data.map(async (requirement) => {
//         const user = await Farmer.findOne({
//           $or: [
//             { traderId: requirement.postedBy },
//             { farmerId: requirement.postedBy }
//           ]
//         }).select(
//           "personalInfo.name personalInfo.mobileNo personalInfo.email " +
//           "personalInfo.taluk personalInfo.district personalInfo.state " +
//           "personalInfo.address personalInfo.villageGramaPanchayat " +
//           "traderId farmerId role registrationStatus isActive"
//         );

//         return {
//           ...requirement.toObject(),
//           userDetails: user ? {
//             name: user.personalInfo?.name || "",
//             mobileNo: user.personalInfo?.mobileNo || "",
//             email: user.personalInfo?.email || "",
//             taluk: user.personalInfo?.taluk || "",
//             district: user.personalInfo?.district || "",
//             state: user.personalInfo?.state || "",
//             address: user.personalInfo?.address || "",
//             village: user.personalInfo?.villageGramaPanchayat || "",
//             userId: user.traderId || user.farmerId || "",
//             role: user.role || "",
//             registrationStatus: user.registrationStatus || "",
//             isActive: user.isActive || false
//           } : null
//         };
//       })
//     );

//     /* ================= RESPONSE ================= */
//     return NextResponse.json({
//       success: true,
//       total,
//       page,
//       limit,
//       data: populatedData
//     });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }

/* ================= POST (CREATE) ================= */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     // Optional: Add user details validation if needed
//     const user = await Farmer.findOne({
//       $or: [
//         { traderId: body.postedBy },
//         { farmerId: body.postedBy }
//       ]
//     });

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     const requirement = await Requirement.create(body);

//     // Populate user details in response
//     const populatedRequirement = {
//       ...requirement.toObject(),
//       userDetails: {
//         name: user.personalInfo?.name || "",
//         mobileNo: user.personalInfo?.mobileNo || "",
//         email: user.personalInfo?.email || "",
//         taluk: user.personalInfo?.taluk || "",
//         district: user.personalInfo?.district || "",
//         state: user.personalInfo?.state || "",
//         userId: user.traderId || user.farmerId || "",
//         role: user.role || ""
//       }
//     };

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Requirement created successfully",
//         data: populatedRequirement,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to create requirement" },
//       { status: 400 }
//     );
//   }
// }

import connectDB from "@/app/lib/Db";
import Requirement from "@/app/models/Requirement";
import { NextRequest, NextResponse } from "next/server";
import Farmer from "@/app/models/Farmer";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    /* ================= QUERY PARAMS ================= */
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const taluk = searchParams.get("taluk");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    /* ================= FILTER OBJECT ================= */
    const filter: any = {};

    // ✅ Status
    if (status) {
      filter.status = status;
    }

    // ✅ Category
    if (category) {
      filter.category = category;
    }

    // ✅ Taluk filter - CRITICAL FIX
    let userIdsFromTaluk: string[] = [];
    if (taluk) {
      // First, get ALL users and check their taluk
      const allUsers = await Farmer.find({}).select(
        "traderId farmerId personalInfo"
      );
      
      console.log("Total users in database:", allUsers.length);
      
      // Filter users by taluk on the server side
      userIdsFromTaluk = allUsers
        .filter(user => {
          const userTaluk = user.personalInfo?.taluk || "";
          return userTaluk.toLowerCase().includes(taluk.toLowerCase());
        })
        .map(user => user.traderId || user.farmerId);
      
      console.log("Users found in taluk", taluk, ":", userIdsFromTaluk);
      
      // If no users found in taluk, return empty results
      if (userIdsFromTaluk.length === 0) {
        return NextResponse.json({
          success: true,
          total: 0,
          page,
          limit,
          data: [],
          message: `No users found in taluk: ${taluk}`
        });
      }
      
      // Add taluk filter to main filter
      filter.postedBy = { $in: userIdsFromTaluk };
    }

    // 🔍 Global Search
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { variety: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    /* ================= DB QUERY ================= */
    console.log("Final filter for requirements:", JSON.stringify(filter, null, 2));
    
    const total = await Requirement.countDocuments(filter);
    console.log("Total requirements matching filter:", total);

    const data = await Requirement.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Requirements fetched:", data.length);

    // Populate user details and verify taluk
    const populatedData = await Promise.all(
      data.map(async (requirement) => {
        const user = await Farmer.findOne({
          $or: [
            { traderId: requirement.postedBy },
            { farmerId: requirement.postedBy }
          ]
        }).select(
          "personalInfo.name personalInfo.mobileNo personalInfo.email " +
          "personalInfo.taluk personalInfo.district personalInfo.state " +
          "personalInfo.address personalInfo.villageGramaPanchayat " +
          "traderId farmerId role registrationStatus isActive"
        );

        const userDetails = user ? {
          name: user.personalInfo?.name || "",
          mobileNo: user.personalInfo?.mobileNo || "",
          email: user.personalInfo?.email || "",
          taluk: user.personalInfo?.taluk || "",
          district: user.personalInfo?.district || "",
          state: user.personalInfo?.state || "",
          address: user.personalInfo?.address || "",
          village: user.personalInfo?.villageGramaPanchayat || "",
          userId: user.traderId || user.farmerId || "",
          role: user.role || "",
          registrationStatus: user.registrationStatus || "",
          isActive: user.isActive || false
        } : null;

        // Debug: Check if user taluk matches search taluk
        if (taluk && userDetails) {
          console.log(`User ${userDetails.userId} taluk: ${userDetails.taluk}, Searching for: ${taluk}`);
        }

        return {
          ...requirement.toObject(),
          userDetails
        };
      })
    );

    // Post-filter: Remove any results that don't match taluk (as a safety check)
    let finalData = populatedData;
    if (taluk) {
      finalData = populatedData.filter(item => {
        if (!item.userDetails) return false;
        const userTaluk = item.userDetails.taluk || "";
        return userTaluk.toLowerCase().includes(taluk.toLowerCase());
      });
      
      console.log(`After post-filtering by taluk "${taluk}":`, finalData.length, "items remain");
    }

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      total: finalData.length,
      page,
      limit,
      data: finalData,
      filterApplied: {
        taluk: taluk || "none",
        search: search || "none",
        status: status || "none",
        category: category || "none"
      }
    });

  } catch (error) {
    console.error("Error in GET /api/requirements:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}