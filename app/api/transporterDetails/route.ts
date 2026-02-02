// import connectDB from "@/app/lib/Db";
// import Order from "@/app/models/Order";
// import { NextRequest, NextResponse } from "next/server";
// import { PipelineStage } from "mongoose";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const search = searchParams.get("search") || "";
//     const status = searchParams.get("status") || ""; // pending | completed
//     const sortBy = searchParams.get("sortBy") || "createdAt";
//     const sortOrder: 1 | -1 =
//       searchParams.get("sortOrder") === "asc" ? 1 : -1;

//     const skip = (page - 1) * limit;

//     /* ------------------ MATCH FILTER ------------------ */
//     const match: Record<string, any> = {};

//     if (status) {
//       match.transporterStatus = status;
//     } 

//     if (search) {
//       match.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { farmerName: { $regex: search, $options: "i" } },
//         { traderName: { $regex: search, $options: "i" } },
//       ];
//     }

//     /* ------------------ SORT FIX ------------------ */
//     const sortStage: Record<string, 1 | -1> = {
//       [sortBy]: sortOrder,
//     };

//     /* ------------------ AGGREGATION PIPELINE ------------------ */
//     const pipeline: PipelineStage[] = [
//       { $match: match },

//       {
//         $project: {
//           _id: 0,
//           orderId: 1,
//           farmerId: 1,
//           farmerName: 1,
//           traderId: 1,
//           traderName: 1,
//           transporterStatus: 1,

//           transporterDetails: {
//             transporterName: 1,
//             vehicleNumber: 1,
//             driverName: 1,
//             transporterReached: 1,
//             goodsConditionCorrect: 1,
//             quantityCorrect: 1,
//             verifiedByName: 1,
//             verifiedAt: 1,
//           },

//           createdAt: 1,
//         },
//       },

//       { $sort: sortStage },
//       { $skip: skip },
//       { $limit: limit },
//     ];

//     const data = await Order.aggregate(pipeline);
//     const totalCount = await Order.countDocuments(match);

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       totalRecords: totalCount,
//       totalPages: Math.ceil(totalCount / limit),
//       data,
//     });
//   } catch (error) {
//     console.error("Shipment Report Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch shipment report" },
//       { status: 500 }
//     );
//   }
// }




import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || ""; // pending | completed
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder: 1 | -1 =
      searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    /* ------------------ MATCH FILTER ------------------ */
    const match: Record<string, any> = {};

    if (status) {
      match.transporterStatus = status;
    } 

    if (search) {
      match.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
        { traderName: { $regex: search, $options: "i" } },
      ];
    }

    /* ------------------ SORT FIX ------------------ */
    const sortStage: Record<string, 1 | -1> = {
      [sortBy]: sortOrder,
    };

    /* ------------------ AGGREGATION PIPELINE ------------------ */
    const pipeline: PipelineStage[] = [
      { $match: match },

      // Lookup farmer details
      {
        $lookup: {
          from: "farmers", // Change if your collection name is different
          localField: "farmerId",
          foreignField: "farmerId",
          as: "farmerDetails"
        }
      },
      {
        $unwind: {
          path: "$farmerDetails",
          preserveNullAndEmptyArrays: true
        }
      },

      // Lookup trader details - try different collection names
      {
        $lookup: {
          from: "traders", // Try "trader" if this doesn't work
          localField: "traderId",
          foreignField: "traderId",
          as: "traderDetails"
        }
      },
      {
        $unwind: {
          path: "$traderDetails",
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $project: {
          _id: 0,
          orderId: 1,
          farmerId: 1,
          farmerName: 1,
          traderId: 1,
          traderName: 1,
          transporterStatus: 1,

          // Farmer location - multiple fallback options
          farmerState: { 
            $ifNull: [
              "$farmerDetails.personalInfo.state",
              "$farmerDetails.state", 
              ""
            ] 
          },
          farmerDistrict: { 
            $ifNull: [
              "$farmerDetails.personalInfo.district",
              "$farmerDetails.district", 
              ""
            ] 
          },
          farmerTaluk: { 
            $ifNull: [
              "$farmerDetails.personalInfo.taluk",
              "$farmerDetails.taluk", 
              ""
            ] 
          },

          // Trader location - multiple fallback options
          traderState: { 
            $ifNull: [
              "$traderDetails.personalInfo.state",
              "$traderDetails.state", 
              ""
            ] 
          },
          traderDistrict: { 
            $ifNull: [
              "$traderDetails.personalInfo.district",
              "$traderDetails.district", 
              ""
            ] 
          },
          traderTaluk: { 
            $ifNull: [
              "$traderDetails.personalInfo.taluk",
              "$traderDetails.taluk", 
              ""
            ] 
          },

          transporterDetails: {
            transporterName: 1,
            vehicleNumber: 1,
            driverName: 1,
            transporterReached: 1,
            goodsConditionCorrect: 1,
            quantityCorrect: 1,
            verifiedByName: 1,
            verifiedAt: 1,
          },

          createdAt: 1,
        },
      },

      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await Order.aggregate(pipeline);
    const totalCount = await Order.countDocuments(match);

    // Log sample data for debugging
    if (data.length > 0) {
      console.log("=== DEBUG: Shipment Report Data ===");
      console.log("First record trader location:", {
        traderId: data[0].traderId,
        traderName: data[0].traderName,
        state: data[0].traderState,
        district: data[0].traderDistrict,
        taluk: data[0].traderTaluk
      });
      console.log("First record farmer location:", {
        farmerId: data[0].farmerId,
        farmerName: data[0].farmerName,
        state: data[0].farmerState,
        district: data[0].farmerDistrict,
        taluk: data[0].farmerTaluk
      });
    }

    return NextResponse.json({
      success: true,
      page,
      limit,
      totalRecords: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    console.error("Shipment Report Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch shipment report" },
      { status: 500 }
    );
  }
}