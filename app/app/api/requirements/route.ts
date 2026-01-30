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
    const status = searchParams.get("status");          // Active / Inactive
    const category = searchParams.get("category");      // Seeds
    const taluk = searchParams.get("taluk");           // New: Taluk filter
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    /* ================= FILTER OBJECT ================= */
    const filter: any = {};

    // 🔍 Global Search
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { variety: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Status
    if (status) {
      filter.status = status;
    }

    // ✅ Category
    if (category) {
      filter.category = category;
    }

    // ✅ Taluk (New filter)
    if (taluk) {
      // First, find all farmers/traders in this taluk
      const usersInTaluk = await Farmer.find({
        $or: [
          { "personalInfo.taluk": { $regex: taluk, $options: "i" } },
          { taluk: { $regex: taluk, $options: "i" } } // For backward compatibility
        ]
      }).select("traderId farmerId");

      // Extract user IDs
      const userIds = usersInTaluk.map(user => user.traderId || user.farmerId);
      
      // Filter requirements by postedBy in these user IDs
      if (userIds.length > 0) {
        filter.postedBy = { $in: userIds };
      } else {
        // If no users found in taluk, return empty results
        return NextResponse.json({
          success: true,
          total: 0,
          page,
          limit,
          data: [],
          message: "No requirements found for this taluk"
        });
      }
    }

    /* ================= DB QUERY ================= */
    const total = await Requirement.countDocuments(filter);

    // Fetch requirements with user details populated
    const data = await Requirement.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Populate user details for each requirement
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

        return {
          ...requirement.toObject(),
          userDetails: user ? {
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
          } : null
        };
      })
    );

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      data: populatedData
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

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
