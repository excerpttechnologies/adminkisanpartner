// import connectDB from "@/app/lib/Db";
// import Agent from "@/app/models/Agent";
// import Category from "@/app/models/Category";
// import Farmer from "@/app/models/Farmer";
// import Labour from "@/app/models/Labours";
// import Order from "@/app/models/Order";
// import Posting from "@/app/models/Posting";
// import { NextResponse } from "next/server";

// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// export async function GET(req: Request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const year = Number(searchParams.get("year")) || new Date().getFullYear();

//     const startDate = new Date(`${year}-01-01`);
//     const endDate = new Date(`${year}-12-31`);

//     const [
//       totalFarmers,
//       totalAgents,
//       totalOrders,
//       pendingOrders,
//       completedOrders,
//       labourRequests,
//       activePostings,
//       totalCategories,
//       orderTrendRaw,

//       // 🔥 PIE CHART DATA
//       postingCategoryDistribution,
//     ] = await Promise.all([
//       Farmer.countDocuments(),
//       Agent.countDocuments(),
//       Order.countDocuments(),
//       Order.countDocuments({ "status.admin": "Pending" }),
//       Order.countDocuments({ "status.admin": "Approved" }),
//       Labour.countDocuments(),
//       Posting.countDocuments({ status: "Approved" }),
//       Category.countDocuments(),

//       Order.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//           },
//         },
//         {
//           $group: {
//             _id: { $month: "$createdAt" },
//             count: { $sum: 1 },
//           },
//         },
//       ]),

//       // 🔥 Category-wise Posting Count
//       Posting.aggregate([
//         { $match: { status: "Approved" } },
//         {
//           $group: {
//             _id: "$category",
//             value: { $sum: 1 },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             name: "$_id",
//             value: 1,
//           },
//         },
//       ]),
//     ]);

//     const orderTrends = MONTHS.map((month, index) => {
//       const found = orderTrendRaw.find(
//         (item: any) => item._id === index + 1
//       );
//       return {
//         month,
//         value: found ? found.count : 0,
//       };
//     });

//     return NextResponse.json({
//       success: true,
//       data: {
//         year,
//         totalFarmers,
//         totalAgents,
//         totalOrders,
//         pendingOrders,
//         completedOrders,
//         labourRequests,
//         activePostings,
//         totalCategories,
//         orderTrends,

//         // 🔥 SEND PIE CHART DATA
//         postingCategoryDistribution,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Dashboard fetch failed" },
//       { status: 500 }
//     );
//   }
// }













import { NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";

import Farmer from "@/app/models/Farmer";
import Agent from "@/app/models/Agent";
import Order from "@/app/models/Order";
import Labour from "@/app/models/Labours";
import Posting from "@/app/models/Posting";
import Category from "@/app/models/Category";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const [
      totalFarmers,
      totalAgents,
      totalOrders,
      pendingOrders,
      completedOrders,
      labourRequests,
      activePostings,
      totalCategories,

      orderTrendRaw,
      cropPostingTrendRaw,
      categoryDistribution,
    ] = await Promise.all([
      /* ===== COUNTS ===== */
      Farmer.countDocuments({ role: "farmer" }),
      Farmer.countDocuments({ role: "trader" }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "completed" }),
      Labour.countDocuments(),
      Posting.countDocuments(),
      Category.countDocuments(),

      /* ===== MONTHLY ORDER TREND ===== */
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ]),

      /* ===== MONTHLY CROP POSTINGS ===== */
      Posting.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ]),

      /* ===== CATEGORY DISTRIBUTION (PIE) ===== */
      Posting.aggregate([
        {
          $group: {
            _id: "$farmingType",
            value: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },
      ]),
    ]);

    /* ===== FORMAT ORDER TREND ===== */
    const orderTrends = MONTHS.map((month, index) => {
      const found = orderTrendRaw.find(
        (item: any) => item._id === index + 1
      );
      return {
        month,
        value: found ? found.count : 0,
      };
    });

    /* ===== FORMAT CROP POSTINGS ===== */
    const monthlyCropPostings = MONTHS.map((month, index) => {
      const found = cropPostingTrendRaw.find(
        (item: any) => item._id === index + 1
      );
      return {
        month,
        value: found ? found.count : 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        year,

        /* COUNTERS */
        totalFarmers,
        totalAgents,
        totalOrders,
        pendingOrders,
        completedOrders,
        labourRequests,
        activePostings,
        totalCategories,

        /* CHARTS */
        orderTrends,
        monthlyCropPostings,
        categoryDistribution,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json(
      { success: false, message: "Dashboard fetch failed" },
      { status: 500 }
    );
  }
}
