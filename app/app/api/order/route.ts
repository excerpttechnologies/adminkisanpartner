// import connectDB from "@/app/lib/Db";
// import Order from "@/app/models/Order";
// import { NextRequest, NextResponse } from "next/server";

// /* ========== LIST (search + paymentStatus filter) ========== */
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);

//     const search = searchParams.get("search") || "";
//     const paymentStatus = searchParams.get("paymentStatus") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;

//     const filter: any = {};

//     // 🔍 Global Search
//     if (search) {
//       filter.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } },
//         { traderId: { $regex: search, $options: "i" } },
//         { orderStatus: { $regex: search, $options: "i" } },
//         { paymentStatus: { $regex: search, $options: "i" } },
//       ];
//     }

//     // 💳 Payment Status Filter (Exact Match)
//     if (paymentStatus) {
//       filter.paymentStatus = paymentStatus;
//     }

//     const total = await Order.countDocuments(filter);

//     const data = await Order.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data,
//     });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return NextResponse.json(
//       { success: false, message: "Fetch failed" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();
//    // console.log("Received order data:", body);

//     const order = await Order.create(body);

//     return NextResponse.json({
//       success: true,
//       data: order,
//       message: "Order created successfully",
//     });
//   } catch (err: any) {
//     console.error("Error creating order:", err);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Create failed",
//         error: err.message 
//       },
//       { status: 400 }
//     );
//   }
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
// import connectDB from "@/app/lib/Db";
// import Order from "@/app/models/Order";
// import { NextRequest, NextResponse } from "next/server";


// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);

//     const search = searchParams.get("search") || "";
//     const paymentStatus = searchParams.get("paymentStatus") || "";
//     const orderStatus = searchParams.get("orderStatus") || "";
//     const transporterStatus = searchParams.get("transporterStatus") || "";
//     const date = searchParams.get("date") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const filter: any = {};

//     // 🔍 Global Search
//     if (search) {
//       filter.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } },
//         { farmerName: { $regex: search, $options: "i" } },
//         { traderId: { $regex: search, $options: "i" } },
//         { traderName: { $regex: search, $options: "i" } },
//         { orderStatus: { $regex: search, $options: "i" } },
//         { "traderToAdminPayment.paymentStatus": { $regex: search, $options: "i" } },
//         { "adminToFarmerPayment.paymentStatus": { $regex: search, $options: "i" } },
//         { "transporterDetails.transporterName": { $regex: search, $options: "i" } },
//       ];
//     }

//     // 💳 Trader Payment Status Filter
//     if (paymentStatus && paymentStatus !== "All") {
//       if (paymentStatus === "paid" || paymentStatus === "pending") {
//         filter["traderToAdminPayment.paymentStatus"] = paymentStatus;
//       }
//     }

//     // 📦 Order Status Filter
//     if (orderStatus && orderStatus !== "All") {
//       filter.orderStatus = orderStatus;
//     }

//     // 🚚 Transporter Status Filter
//     if (transporterStatus && transporterStatus !== "All") {
//       filter.transporterStatus = transporterStatus;
//     }

//     // 📅 Date Filter
//     if (date) {
//       const startDate = new Date(date);
//       startDate.setHours(0, 0, 0, 0);
      
//       const endDate = new Date(date);
//       endDate.setHours(23, 59, 59, 999);
      
//       filter.createdAt = {
//         $gte: startDate,
//         $lte: endDate
//       };
//     }

//     const total = await Order.countDocuments(filter);

//     const data = await Order.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data,
//     });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return NextResponse.json(
//       { success: false, message: "Fetch failed" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();
//    // console.log("Received order data:", body);

//     const order = await Order.create(body);

//     return NextResponse.json({
//       success: true,
//       data: order,
//       message: "Order created successfully",
//     });
//   } catch (err: any) {
//     console.error("Error creating order:", err);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Create failed",
//         error: err.message 
//       },
//       { status: 400 }
//     );
//   }
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import Farmer from "@/app/models/Farmer"; // This model contains both farmers and traders
import { NextRequest, NextResponse } from "next/server";

/* ========== LIST (search + paymentStatus filter) with taluk filtering ========== */

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const orderStatus = searchParams.get("orderStatus") || "";
    const transporterStatus = searchParams.get("transporterStatus") || "";
    const date = searchParams.get("date") || "";
    const taluk = searchParams.get("taluk") || ""; // New: taluk filter
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 0; // Changed: 0 means no limit initially

    // Base filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    // 🔍 Global Search
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
        { traderId: { $regex: search, $options: "i" } },
        { traderName: { $regex: search, $options: "i" } },
        { orderStatus: { $regex: search, $options: "i" } },
        { "traderToAdminPayment.paymentStatus": { $regex: search, $options: "i" } },
        { "adminToFarmerPayment.paymentStatus": { $regex: search, $options: "i" } },
        { "transporterDetails.transporterName": { $regex: search, $options: "i" } },
      ];
    }

    // 💳 Trader Payment Status Filter
    if (paymentStatus && paymentStatus !== "All") {
      if (paymentStatus === "paid" || paymentStatus === "pending" || paymentStatus === "partial") {
        filter["traderToAdminPayment.paymentStatus"] = paymentStatus;
      }
    }

    // 📦 Order Status Filter
    if (orderStatus && orderStatus !== "All") {
      filter.orderStatus = orderStatus;
    }

    // 🚚 Transporter Status Filter
    if (transporterStatus && transporterStatus !== "All") {
      filter.transporterStatus = transporterStatus;
    }

    // 📅 Date Filter
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Fetch all orders first
    let allOrders = await Order.find(filter).sort({ createdAt: -1 });

    // If taluk filter is provided, filter orders by trader or farmer taluk
    if (taluk) {
      // Get all farmer and trader IDs from orders
      const farmerIds = allOrders.map(order => order.farmerId).filter(Boolean);
      const traderIds = allOrders.map(order => order.traderId).filter(Boolean);
      
      // Fetch farmers/traders with matching taluk
      const matchingUsers = await Farmer.find({
        $or: [
          { farmerId: { $in: farmerIds }, "personalInfo.taluk": taluk },
          { traderId: { $in: traderIds }, "personalInfo.taluk": taluk }
        ]
      });
      
      // Create sets of matching IDs
      const matchingFarmerIds = new Set(
        matchingUsers.filter(user => user.farmerId).map(user => user.farmerId)
      );
      const matchingTraderIds = new Set(
        matchingUsers.filter(user => user.traderId).map(user => user.traderId)
      );
      
      // Filter orders where either farmer or trader has matching taluk
      allOrders = allOrders.filter(order => {
        const hasMatchingFarmer = order.farmerId && matchingFarmerIds.has(order.farmerId);
        const hasMatchingTrader = order.traderId && matchingTraderIds.has(order.traderId);
        return hasMatchingFarmer || hasMatchingTrader;
      });
    }

    const total = allOrders.length;

    // Apply pagination only if limit > 0
    let paginatedOrders = allOrders;
    if (limit > 0) {
      const startIndex = (page - 1) * limit;
      paginatedOrders = allOrders.slice(startIndex, startIndex + limit);
    }

    // Fetch farmer and trader details for the paginated orders
    const farmerIds = paginatedOrders.map(order => order.farmerId).filter(Boolean);
    const traderIds = paginatedOrders.map(order => order.traderId).filter(Boolean);
    
    const farmerDetails = await Farmer.find({ farmerId: { $in: farmerIds } });
    const traderDetails = await Farmer.find({ traderId: { $in: traderIds } });

    // Create lookup maps for easy access
    const farmerMap = new Map(farmerDetails.map(farmer => [farmer.farmerId, farmer]));
    const traderMap = new Map(traderDetails.map(trader => [trader.traderId, trader]));

    // Enhance orders with farmer and trader details
    const enhancedOrders = paginatedOrders.map(order => {
      const orderObj = order.toObject();
      
      // Add farmer details
      if (order.farmerId && farmerMap.has(order.farmerId)) {
        const farmer = farmerMap.get(order.farmerId);
        orderObj.farmerDetails = {
          farmerId: farmer.farmerId,
          name: farmer.personalInfo?.name || order.farmerName,
          mobileNo: farmer.personalInfo?.mobileNo || "",
          email: farmer.personalInfo?.email || "",
          taluk: farmer.personalInfo?.taluk || "",
          district: farmer.personalInfo?.district || "",
          state: farmer.personalInfo?.state || "",
          address: farmer.personalInfo?.address || "",
          villageGramaPanchayat: farmer.personalInfo?.villageGramaPanchayat || ""
        };
      } else {
        orderObj.farmerDetails = {
          farmerId: order.farmerId || "",
          name: order.farmerName || "",
          mobileNo: "",
          email: "",
          taluk: "",
          district: "",
          state: "",
          address: "",
          villageGramaPanchayat: ""
        };
      }

      // Add trader details
      if (order.traderId && traderMap.has(order.traderId)) {
        const trader = traderMap.get(order.traderId);
        orderObj.traderDetails = {
          traderId: trader.traderId,
          name: trader.personalInfo?.name || order.traderName,
          mobileNo: trader.personalInfo?.mobileNo || "",
          email: trader.personalInfo?.email || "",
          taluk: trader.personalInfo?.taluk || "",
          district: trader.personalInfo?.district || "",
          state: trader.personalInfo?.state || "",
          address: trader.personalInfo?.address || "",
          villageGramaPanchayat: trader.personalInfo?.villageGramaPanchayat || ""
        };
      } else {
        orderObj.traderDetails = {
          traderId: order.traderId || "",
          name: order.traderName || "",
          mobileNo: "",
          email: "",
          taluk: "",
          district: "",
          state: "",
          address: "",
          villageGramaPanchayat: ""
        };
      }

      return orderObj;
    });

    return NextResponse.json({
      success: true,
      page,
      limit: limit > 0 ? limit : total, // Return total count if no limit
      total,
      data: enhancedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Fetch failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}



export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
   // console.log("Received order data:", body);

    const order = await Order.create(body);

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Create failed",
        error: err.message 
      },
      { status: 400 }
    );
  }
}