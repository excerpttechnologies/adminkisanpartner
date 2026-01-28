














// import connectDB from "@/app/lib/Db";
// import Cropcareorders from "@/app/models/cropcareorders";
// import { NextRequest, NextResponse } from "next/server";
// import { PipelineStage } from "mongoose";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     // Query params
//     const page = parseInt(searchParams.get("page") ?? "1", 10);
//     const limit = parseInt(searchParams.get("limit") ?? "10", 10);
//     const search = searchParams.get("search") ?? "";
//     const sortBy = searchParams.get("sortBy") ?? "createdAt";
//     const order: 1 | -1 = searchParams.get("order") === "asc" ? 1 : -1;

//     const userId = searchParams.get("userId");
//     const orderStatus = searchParams.get("orderStatus");
//     const paymentStatus = searchParams.get("paymentStatus");
//     const state = searchParams.get("state");
//     const district = searchParams.get("district");
//     const taluk = searchParams.get("taluk");

//     const skip = (page - 1) * limit;

//     // Match conditions
//     const matchConditions: any = {};

//     if (userId) {
//       matchConditions.userId = userId; // Changed from ObjectId to string
//     }

//     if (orderStatus) {
//       matchConditions.orderStatus = orderStatus;
//     }

//     if (paymentStatus) {
//       matchConditions["payment.status"] = paymentStatus;
//     }

//     if (state) {
//       matchConditions["shippingAddress.state"] = { $regex: state, $options: "i" };
//     }

//     if (district) {
//       matchConditions["shippingAddress.district"] = { $regex: district, $options: "i" };
//     }

//     if (taluk) {
//       matchConditions["shippingAddress.taluk"] = { $regex: taluk, $options: "i" };
//     }

//     if (search) {
//       matchConditions.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { userId: { $regex: search, $options: "i" } },
//         { "shippingAddress.name": { $regex: search, $options: "i" } },
//         { "shippingAddress.mobileNo": { $regex: search, $options: "i" } },
//         { "items.productName": { $regex: search, $options: "i" } },
//         { "items.seedName": { $regex: search, $options: "i" } },
//         { "shippingAddress.state": { $regex: search, $options: "i" } },
//         { "shippingAddress.district": { $regex: search, $options: "i" } },
//         { "shippingAddress.taluk": { $regex: search, $options: "i" } },
//       ];
//     }

//     // Aggregation pipeline
//     const pipeline: PipelineStage[] = [
//       {
//         $match: matchConditions,
//       },

//       // Sort
//       {
//         $sort: {
//           [sortBy]: order,
//         } as Record<string, 1 | -1>,
//       },

//       // Pagination
//       { $skip: skip },
//       { $limit: limit },

//       // Project required fields
//       {
//         $project: {
//           _id: 1,
//           orderId: 1,
//           userId: 1,
//           items: 1,
//           shippingAddress: 1,
//           payment: 1,
//           orderStatus: 1,
//           subtotal: 1,
//           gst: 1,
//           shipping: 1,
//           total: 1,
//           createdAt: 1,
//           updatedAt: 1,
//         },
//       },
//     ];

//     const data = await Cropcareorders.aggregate(pipeline);

//     // Total count pipeline
//     const totalCountPipeline: PipelineStage[] = [
//       { $match: matchConditions },
//       { $count: "total" },
//     ];

//     const totalResult = await Cropcareorders.aggregate(totalCountPipeline);
//     const total = totalResult[0]?.total ?? 0;

//     const cropOrder=await Cropcareorders.find({})

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data,
//       cropOrder
//     });
//   } catch (error) {
//     console.error("Cropcare Orders Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }






import connectDB from "@/app/lib/Db";
import Cropcareorders from "@/app/models/cropcareorders";
import Farmer from "@/app/models/Farmer";
import Transporter from "@/app/models/Transporter";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Query params
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const order: 1 | -1 = searchParams.get("order") === "asc" ? 1 : -1;

    const userId = searchParams.get("userId");
    const orderStatus = searchParams.get("orderStatus");
    const paymentStatus = searchParams.get("paymentStatus");
    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const taluk = searchParams.get("taluk");
    const farmerTaluk = searchParams.get("farmerTaluk");
    const role = searchParams.get("role");

    const skip = (page - 1) * limit;

    // Start building the aggregation pipeline
    const pipeline: PipelineStage[] = [];

    // Stage 1: Lookup user details based on userId
    pipeline.push({
      $lookup: {
        from: "farmers",
        let: { orderUserId: "$userId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$farmerId", "$$orderUserId"] },
                  { $eq: ["$traderId", "$$orderUserId"] }
                ]
              }
            }
          },
          {
            $project: {
              personalInfo: 1,
              farmerId: 1,
              traderId: 1,
              transporterId: 1,
              role: 1,
              registrationStatus: 1,
              isActive: 1
            }
          }
        ],
        as: "farmerDetails"
      }
    });

    // Stage 2: Lookup transporter details if not found in farmers
    pipeline.push({
      $lookup: {
        from: "transporters",
        let: { orderUserId: "$userId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$transporterId", "$$orderUserId"] }
            }
          },
          {
            $project: {
              personalInfo: 1,
              transporterId: 1,
              role: 1,
              registrationStatus: 1,
              isActive: 1
            }
          }
        ],
        as: "transporterDetails"
      }
    });

    // Stage 3: Combine user details
    pipeline.push({
      $addFields: {
        userDetails: {
          $cond: {
            if: { $gt: [{ $size: "$farmerDetails" }, 0] },
            then: { $arrayElemAt: ["$farmerDetails", 0] },
            else: {
              $cond: {
                if: { $gt: [{ $size: "$transporterDetails" }, 0] },
                then: { $arrayElemAt: ["$transporterDetails", 0] },
                else: null
              }
            }
          }
        }
      }
    });

    // Stage 4: Add user's taluk field for filtering
    pipeline.push({
      $addFields: {
        userTaluk: {
          $cond: {
            if: { $ne: ["$userDetails", null] },
            then: "$userDetails.personalInfo.taluk",
            else: "$shippingAddress.taluk"
          }
        },
        userState: {
          $cond: {
            if: { $ne: ["$userDetails", null] },
            then: "$userDetails.personalInfo.state",
            else: "$shippingAddress.state"
          }
        },
        userDistrict: {
          $cond: {
            if: { $ne: ["$userDetails", null] },
            then: "$userDetails.personalInfo.district",
            else: "$shippingAddress.district"
          }
        },
        userRole: "$userDetails.role"
      }
    });

    // Build match conditions - FIXED: Separate filters for different conditions
    const matchConditions: any = {};

    if (userId) {
      matchConditions.userId = userId;
    }

    if (orderStatus) {
      matchConditions.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      matchConditions["payment.status"] = paymentStatus;
    }

    // Handle state filter - FIXED: Use separate condition instead of $or
    if (state) {
      matchConditions.$or = [
        { "shippingAddress.state": { $regex: state, $options: "i" } },
        { userState: { $regex: state, $options: "i" } }
      ];
    }

    // Handle district filter - FIXED: Use separate condition instead of $or
    if (district) {
      matchConditions.$or = [
        { "shippingAddress.district": { $regex: district, $options: "i" } },
        { userDistrict: { $regex: district, $options: "i" } }
      ];
    }

    // Handle taluk filter - FIXED: This should be a separate AND condition
    // if (taluk) {
    //   matchConditions.$or = [
    //     { "shippingAddress.taluk": { $regex: taluk, $options: "i" } },
    //     { userTaluk: { $regex: taluk, $options: "i" } }
    //   ];
    // }

    if (taluk) {
  matchConditions.$or = [
    { "shippingAddress.taluk": { $regex: `^${taluk}$`, $options: "i" } },
    { userTaluk: { $regex: `^${taluk}$`, $options: "i" } }
  ];
}


    // Handle role filter
    if (role && role !== "All") {
      matchConditions.userRole = role;
    }

    // FIXED: Handle search parameter separately to avoid overriding other filters
    // If search is provided, we need to combine it with other filters
    if (search) {
      // Create search conditions
      const searchConditions = {
        $or: [
          { orderId: { $regex: search, $options: "i" } },
          { userId: { $regex: search, $options: "i" } },
          { "shippingAddress.name": { $regex: search, $options: "i" } },
          { "shippingAddress.mobileNo": { $regex: search, $options: "i" } },
          { "items.productName": { $regex: search, $options: "i" } },
          { "items.seedName": { $regex: search, $options: "i" } },
          { "shippingAddress.state": { $regex: search, $options: "i" } },
          { "shippingAddress.district": { $regex: search, $options: "i" } },
          { "shippingAddress.taluk": { $regex: search, $options: "i" } },
          { userState: { $regex: search, $options: "i" } },
          { userDistrict: { $regex: search, $options: "i" } },
          { userTaluk: { $regex: search, $options: "i" } }
        ]
      };

      // If we already have other conditions, combine them with AND
      if (Object.keys(matchConditions).length > 0) {
        // Create a combined match condition
        pipeline.push({
          $match: {
            $and: [
              matchConditions,
              searchConditions
            ]
          }
        });
      } else {
        // Only search condition
        pipeline.push({
          $match: searchConditions
        });
      }
    } else if (Object.keys(matchConditions).length > 0) {
      // Only filter conditions (no search)
      pipeline.push({
        $match: matchConditions
      });
    }

    // New: Filter by farmer's taluk from Farmer collection
    if (farmerTaluk && farmerTaluk !== "All") {
      // Since we need to filter by farmer taluk, we need to adjust the approach
      // We'll do this after initial aggregation to get better performance
      const farmersInTaluk = await Farmer.find(
        {
          "personalInfo.taluk": { $regex: farmerTaluk, $options: "i" },
          role: "farmer"
        },
        { farmerId: 1, traderId: 1 }
      );

      const farmerIds = farmersInTaluk.map(f => f.farmerId).filter(id => id);
      const traderIds = farmersInTaluk.map(f => f.traderId).filter(id => id);
      
      const allUserIds = [...farmerIds, ...traderIds];

      if (allUserIds.length === 0) {
        // No farmers/traders found in this taluk, return empty result
        return NextResponse.json({
          success: true,
          page,
          limit,
          total: 0,
          totalPages: 0,
          data: [],
          filterApplied: {
            farmerTaluk,
            userCount: 0
          }
        });
      }

      // Add userId filter at the beginning of match conditions
      // We need to push a separate match stage for this
      pipeline.push({
        $match: {
          userId: { $in: allUserIds }
        }
      });
    }

    // Stage 5: Sort
    pipeline.push({
      $sort: {
        [sortBy]: order
      } as Record<string, 1 | -1>
    });

    // Stage 6: Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Stage 7: Project required fields
    pipeline.push({
      $project: {
        _id: 1,
        orderId: 1,
        userId: 1,
        items: 1,
        shippingAddress: 1,
        payment: 1,
        orderStatus: 1,
        subtotal: 1,
        gst: 1,
        shipping: 1,
        total: 1,
        createdAt: 1,
        updatedAt: 1,
        userDetails: {
          personalInfo: 1,
          farmerId: 1,
          traderId: 1,
          transporterId: 1,
          role: 1,
          registrationStatus: 1,
          isActive: 1
        },
        userTaluk: 1,
        userState: 1,
        userDistrict: 1,
        userRole: 1
      }
    });

    // Execute aggregation pipeline
    const data = await Cropcareorders.aggregate(pipeline);

    // Get total count
    const countPipeline = [...pipeline];
    // Remove pagination stages for count
    countPipeline.pop(); // Remove $limit
    countPipeline.pop(); // Remove $skip
    countPipeline.pop(); // Remove $sort
    // Remove project stage if exists
    // if (countPipeline[countPipeline.length - 1]?.$project) {
    //   countPipeline.pop(); // Remove $project
    // }
    


    const lastStage = countPipeline[countPipeline.length - 1];

if (lastStage && "$project" in lastStage) {
  countPipeline.pop();
}

    // Add count stage
    countPipeline.push({ $count: "total" });
    
    const totalResult = await Cropcareorders.aggregate(countPipeline);
    const total = totalResult[0]?.total ?? 0;

    // Get filter options for dropdowns
    const farmerTaluks = await Farmer.distinct("personalInfo.taluk", {
      role: "farmer",
      "personalInfo.taluk": { $exists: true, $ne: "" }
    }).sort();

    const transporterTaluks = await Transporter.distinct("personalInfo.taluk", {
      role: "transport",
      "personalInfo.taluk": { $exists: true, $ne: "" }
    }).sort();

    // Combine all unique taluks
    const allTaluks = [...new Set([...farmerTaluks, ...transporterTaluks])].sort();

    // Get unique states for filter
    const farmerStates = await Farmer.distinct("personalInfo.state", {
      role: "farmer",
      "personalInfo.state": { $exists: true, $ne: "" }
    }).sort();

    const transporterStates = await Transporter.distinct("personalInfo.state", {
      role: "transport",
      "personalInfo.state": { $exists: true, $ne: "" }
    }).sort();

    const allStates = [...new Set([...farmerStates, ...transporterStates])].sort();
    const cropOrder=await Cropcareorders.find({})
    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
      cropOrder,
      filterOptions: {
        taluks: allTaluks,
        states: allStates,
        roles: ["farmer", "trader", "transport"]
      },
      filterApplied: {
        farmerTaluk: farmerTaluk || "All",
        role: role || "All",
        state: state || "All",
        district: district || "All",
        taluk: taluk || "All",
        search: search || ""
      }
    });
  } catch (error) {
    console.error("Cropcare Orders Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server Error",
        error: (error as Error).message 
      },
      { status: 500 }
    );
  }
}