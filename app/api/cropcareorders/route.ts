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

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data,
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

    const skip = (page - 1) * limit;

    // Match conditions
    const matchConditions: any = {};

    if (userId) {
      matchConditions.userId = userId; // Changed from ObjectId to string
    }

    if (orderStatus) {
      matchConditions.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      matchConditions["payment.status"] = paymentStatus;
    }

    if (state) {
      matchConditions["shippingAddress.state"] = { $regex: state, $options: "i" };
    }

    if (district) {
      matchConditions["shippingAddress.district"] = { $regex: district, $options: "i" };
    }

    if (taluk) {
      matchConditions["shippingAddress.taluk"] = { $regex: taluk, $options: "i" };
    }

    if (search) {
      matchConditions.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { userId: { $regex: search, $options: "i" } },
        { "shippingAddress.name": { $regex: search, $options: "i" } },
        { "shippingAddress.mobileNo": { $regex: search, $options: "i" } },
        { "items.productName": { $regex: search, $options: "i" } },
        { "items.seedName": { $regex: search, $options: "i" } },
        { "shippingAddress.state": { $regex: search, $options: "i" } },
        { "shippingAddress.district": { $regex: search, $options: "i" } },
        { "shippingAddress.taluk": { $regex: search, $options: "i" } },
      ];
    }

    // Aggregation pipeline
    const pipeline: PipelineStage[] = [
      {
        $match: matchConditions,
      },

      // Sort
      {
        $sort: {
          [sortBy]: order,
        } as Record<string, 1 | -1>,
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },

      // Project required fields
      {
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
        },
      },
    ];

    const data = await Cropcareorders.aggregate(pipeline);

    // Total count pipeline
    const totalCountPipeline: PipelineStage[] = [
      { $match: matchConditions },
      { $count: "total" },
    ];

    const totalResult = await Cropcareorders.aggregate(totalCountPipeline);
    const total = totalResult[0]?.total ?? 0;

    const cropOrder=await Cropcareorders.find({})

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
      cropOrder
    });
  } catch (error) {
    console.error("Cropcare Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}