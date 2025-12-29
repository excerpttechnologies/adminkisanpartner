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
import connectDB from "@/app/lib/Db";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";

/* ========== LIST (search + paymentStatus filter) ========== */
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
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const orderStatus = searchParams.get("orderStatus") || "";
    const transporterStatus = searchParams.get("transporterStatus") || "";
    const date = searchParams.get("date") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

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
      if (paymentStatus === "paid" || paymentStatus === "pending") {
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

    const total = await Order.countDocuments(filter);

    const data = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
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