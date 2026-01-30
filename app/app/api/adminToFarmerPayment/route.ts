
// import connectDB from "@/app/lib/Db";
// import Order from "@/app/models/Order";
// import { NextRequest, NextResponse } from "next/server";
// import { PipelineStage } from "mongoose";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     // 🔢 Query params
//     const page = parseInt(searchParams.get("page") ?? "1", 10);
//     const limit = parseInt(searchParams.get("limit") ?? "10", 10);
//     const search = searchParams.get("search") ?? "";
//     const sortBy = searchParams.get("sortBy") ?? "createdAt";
//     const order: 1 | -1 = searchParams.get("order") === "asc" ? 1 : -1;
//     const paymentStatus = searchParams.get("paymentStatus") ?? "";
//     const paymentMethod = searchParams.get("paymentMethod") ?? "";
//     const startDate = searchParams.get("startDate") ?? "";
//     const endDate = searchParams.get("endDate") ?? "";

//     const skip = (page - 1) * limit;

//     // 🔥 Build match conditions dynamically
//     const matchConditions: any = {
//       adminToFarmerPayment: { $exists: true }
//     };

//     // Search condition
//     if (search) {
//       matchConditions.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } },
//         { farmerName: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Payment status condition
//     if (paymentStatus) {
//       matchConditions["adminToFarmerPayment.paymentStatus"] = paymentStatus;
//     }

//     // Date range condition
//     const dateConditions: any = {};
//     if (startDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
//       dateConditions.$gte = start;
//     }
//     if (endDate) {
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       dateConditions.$lte = end;
//     }
//     if (startDate || endDate) {
//       matchConditions.createdAt = dateConditions;
//     }

//     // 🔥 AGGREGATION PIPELINE
//     const pipeline: PipelineStage[] = [
//       // 1️⃣ Only orders having adminToFarmerPayment with filters
//       {
//         $match: matchConditions,
//       },

//       // 2️⃣ Unwind paymentHistory (for report rows)
//       {
//         $unwind: {
//           path: "$adminToFarmerPayment.paymentHistory",
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       // 3️⃣ Filter by payment method if specified
//       ...(paymentMethod ? [
//         {
//           $match: {
//             "adminToFarmerPayment.paymentHistory.paymentMethod": paymentMethod
//           }
//         }
//       ] : []),

//       // 4️⃣ Project required fields only
//       {
//         $project: {
//           _id: 0,
//           orderId: 1,
//           farmerId: 1,
//           farmerName: 1,
//           createdAt: 1,

//           totalAmount: "$adminToFarmerPayment.totalAmount",
//           paidAmount: "$adminToFarmerPayment.paidAmount",
//           remainingAmount: "$adminToFarmerPayment.remainingAmount",
//           paymentStatus: "$adminToFarmerPayment.paymentStatus",

//           paymentAmount: "$adminToFarmerPayment.paymentHistory.amount",
//           paymentMethod: "$adminToFarmerPayment.paymentHistory.paymentMethod",
//           paidDate: "$adminToFarmerPayment.paymentHistory.paidDate",
//         },
//       },

//       // 5️⃣ Sort
//       {
//         $sort: {
//           [sortBy]: order,
//         } as Record<string, 1 | -1>,
//       },

//       // 6️⃣ Pagination
//       { $skip: skip },
//       { $limit: limit },
//     ];

//     // For counting total records (without pagination)
//     const countPipeline: PipelineStage[] = [
//       {
//         $match: matchConditions,
//       },
//       {
//         $unwind: {
//           path: "$adminToFarmerPayment.paymentHistory",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       ...(paymentMethod ? [
//         {
//           $match: {
//             "adminToFarmerPayment.paymentHistory.paymentMethod": paymentMethod
//           }
//         }
//       ] : []),
//       { $count: "total" },
//     ];

//     // Execute both pipelines in parallel for better performance
//     const [data, totalResult] = await Promise.all([
//       Order.aggregate(pipeline),
//       Order.aggregate(countPipeline),
//     ]);

//     const total = totalResult[0]?.total ?? 0;

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data,
//     });
//   } catch (error) {
//     console.error("Farmer Payments Report Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }













import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import Farmer from "@/app/models/Farmer";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // 🔢 Query params
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const order: 1 | -1 = searchParams.get("order") === "asc" ? 1 : -1;
    const paymentStatus = searchParams.get("paymentStatus") ?? "";
    const paymentMethod = searchParams.get("paymentMethod") ?? "";
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    
    // 🔍 New filters
    const farmerId = searchParams.get("farmerId") ?? "";
    const state = searchParams.get("state") ?? "";
    const district = searchParams.get("district") ?? "";
    const taluka = searchParams.get("taluk") ?? "";

    const skip = (page - 1) * limit;

    // 🔥 Build match conditions dynamically
    const matchConditions: any = {
      adminToFarmerPayment: { $exists: true }
    };

    // Search condition
    if (search) {
      matchConditions.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
      ];
    }

    // Farmer ID condition
    if (farmerId) {
      matchConditions.farmerId = farmerId;
    }

    // Payment status condition
    if (paymentStatus) {
      matchConditions["adminToFarmerPayment.paymentStatus"] = paymentStatus;
    }

    // Date range condition
    const dateConditions: any = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateConditions.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateConditions.$lte = end;
    }
    if (startDate || endDate) {
      matchConditions.createdAt = dateConditions;
    }

    // 🔥 AGGREGATION PIPELINE
    const pipeline: PipelineStage[] = [
      // 1️⃣ Only orders having adminToFarmerPayment with filters
      {
        $match: matchConditions,
      },

      // 2️⃣ Lookup farmer details to get state, district, taluka
      {
        $lookup: {
          from: "farmers",
          let: { orderFarmerId: "$farmerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$farmerId", "$$orderFarmerId"]
                }
              }
            },
            {
              $project: {
                state: "$personalInfo.state",
                district: "$personalInfo.district",
                taluka: "$personalInfo.taluk",
                mobileNo: "$personalInfo.mobileNo",
                address: "$personalInfo.address",
                pincode: "$personalInfo.pincode"
              }
            }
          ],
          as: "farmerDetails"
        }
      },

      // 3️⃣ Add farmer details fields
      {
        $addFields: {
          farmerState: { $arrayElemAt: ["$farmerDetails.state", 0] },
          farmerDistrict: { $arrayElemAt: ["$farmerDetails.district", 0] },
          farmerTaluka: { $arrayElemAt: ["$farmerDetails.taluka", 0] },
          farmerMobile: { $arrayElemAt: ["$farmerDetails.mobileNo", 0] },
          farmerAddress: { $arrayElemAt: ["$farmerDetails.address", 0] },
          farmerPincode: { $arrayElemAt: ["$farmerDetails.pincode", 0] }
        }
      },

      // 4️⃣ Apply state/district/taluka filters
      ...(state || district || taluka ? [
        {
          $match: {
            ...(state ? { farmerState: state } : {}),
            ...(district ? { farmerDistrict: district } : {}),
            ...(taluka ? { farmerTaluka: taluka } : {})
          }
        }
      ] : []),

      // 5️⃣ Unwind paymentHistory (for report rows)
      {
        $unwind: {
          path: "$adminToFarmerPayment.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 6️⃣ Filter by payment method if specified
      ...(paymentMethod ? [
        {
          $match: {
            "adminToFarmerPayment.paymentHistory.paymentMethod": paymentMethod
          }
        }
      ] : []),

      // 7️⃣ Project required fields only
      {
        $project: {
          _id: 0,
          orderId: 1,
          farmerId: 1,
          farmerName: 1,
          createdAt: 1,

          // Farmer details
          farmerState: 1,
          farmerDistrict: 1,
          farmerTaluka: 1,
          farmerMobile: 1,
          farmerAddress: 1,
          farmerPincode: 1,

          // Payment summary
          totalAmount: "$adminToFarmerPayment.totalAmount",
          paidAmount: "$adminToFarmerPayment.paidAmount",
          remainingAmount: "$adminToFarmerPayment.remainingAmount",
          paymentStatus: "$adminToFarmerPayment.paymentStatus",

          // Payment history details
          paymentAmount: "$adminToFarmerPayment.paymentHistory.amount",
          paymentMethod: "$adminToFarmerPayment.paymentHistory.paymentMethod",
          paidDate: "$adminToFarmerPayment.paymentHistory.paidDate",
        },
      },

      // 8️⃣ Sort
      {
        $sort: {
          [sortBy]: order,
        } as Record<string, 1 | -1>,
      },

      // 9️⃣ Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    // For counting total records (without pagination)
    const countPipeline: PipelineStage[] = [
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "farmers",
          let: { orderFarmerId: "$farmerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$farmerId", "$$orderFarmerId"]
                }
              }
            },
            {
              $project: {
                state: "$personalInfo.state",
                district: "$personalInfo.district",
                taluka: "$personalInfo.taluk",
              }
            }
          ],
          as: "farmerDetails"
        }
      },
      {
        $addFields: {
          farmerState: { $arrayElemAt: ["$farmerDetails.state", 0] },
          farmerDistrict: { $arrayElemAt: ["$farmerDetails.district", 0] },
          farmerTaluka: { $arrayElemAt: ["$farmerDetails.taluka", 0] },
        }
      },
      ...(state || district || taluka ? [
        {
          $match: {
            ...(state ? { farmerState: state } : {}),
            ...(district ? { farmerDistrict: district } : {}),
            ...(taluka ? { farmerTaluka: taluka } : {})
          }
        }
      ] : []),
      {
        $unwind: {
          path: "$adminToFarmerPayment.paymentHistory",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(paymentMethod ? [
        {
          $match: {
            "adminToFarmerPayment.paymentHistory.paymentMethod": paymentMethod
          }
        }
      ] : []),
      { $count: "total" },
    ];

    // Execute both pipelines in parallel for better performance
    const [data, totalResult, aggregationStats] = await Promise.all([
      Order.aggregate(pipeline),
      Order.aggregate(countPipeline),
      // Get aggregation stats for filters
      getAggregationStats(matchConditions),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
      // Return aggregation stats for filter options
      filters: {
        states: aggregationStats.states,
        districts: aggregationStats.districts,
        talukas: aggregationStats.talukas,
      },
    });
  } catch (error) {
    console.error("Farmer Payments Report Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Helper function to get aggregation stats for filters
async function getAggregationStats(matchConditions: any) {
  try {
    const statsPipeline: PipelineStage[] = [
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "farmers",
          let: { orderFarmerId: "$farmerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$farmerId", "$$orderFarmerId"]
                }
              }
            },
            {
              $project: {
                state: "$personalInfo.state",
                district: "$personalInfo.district",
                taluka: "$personalInfo.taluk",
              }
            }
          ],
          as: "farmerDetails"
        }
      },
      {
        $group: {
          _id: null,
          states: { $addToSet: { $arrayElemAt: ["$farmerDetails.state", 0] } },
          districts: { $addToSet: { $arrayElemAt: ["$farmerDetails.district", 0] } },
          talukas: { $addToSet: { $arrayElemAt: ["$farmerDetails.taluka", 0] } },
        }
      },
      {
        $project: {
          _id: 0,
          states: {
            $filter: {
              input: "$states",
              as: "state",
              cond: { $ne: ["$$state", null] }
            }
          },
          districts: {
            $filter: {
              input: "$districts",
              as: "district",
              cond: { $ne: ["$$district", null] }
            }
          },
          talukas: {
            $filter: {
              input: "$talukas",
              as: "taluka",
              cond: { $ne: ["$$taluka", null] }
            }
          },
        }
      },
    ];

    const result = await Order.aggregate(statsPipeline);
    return result[0] || { states: [], districts: [], talukas: [] };
  } catch (error) {
    console.error("Aggregation stats error:", error);
    return { states: [], districts: [], talukas: [] };
  }
}

// 🔍 OPTIONAL: Separate endpoint to get all unique filter values
export async function GETFilterOptions(req: NextRequest) {
  try {
    await connectDB();

    const farmers = await Farmer.aggregate([
      {
        $match: {
          role: "farmer",
          "personalInfo.state": { $exists: true, $ne: "" }
        }
      },
      {
        $group: {
          _id: null,
          states: { $addToSet: "$personalInfo.state" },
          districts: { $addToSet: "$personalInfo.district" },
          talukas: { $addToSet: "$personalInfo.taluk" },
        }
      },
      {
        $project: {
          _id: 0,
          states: { $sortArray: { input: "$states", sortBy: 1 } },
          districts: { $sortArray: { input: "$districts", sortBy: 1 } },
          talukas: { $sortArray: { input: "$talukas", sortBy: 1 } },
        }
      },
    ]);

    const filterOptions = farmers[0] || { states: [], districts: [], talukas: [] };

    return NextResponse.json({
      success: true,
      data: filterOptions,
    });
  } catch (error) {
    console.error("Filter options error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}