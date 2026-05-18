// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import B2BOrder from "@/app/models/B2BOrder";
// import "@/app/models/b2bUsers"; // needed for populate

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     // =========================
//     // QUERY PARAMS
//     // =========================
//     const { searchParams } = new URL(req.url);

//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const status = searchParams.get("status"); // pending, delivered etc
//     const search = searchParams.get("search"); // orderId / name
//     const sortField = searchParams.get("sortField") || "createdAt";
//     const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

//     const skip = (page - 1) * limit;

//     // =========================
//     // FILTER BUILD
//     // =========================
//     const filter: any = {};

//     if (status && status !== "all") {
//       filter.status = status;
//     }

//     if (search) {
//       filter.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { "addressSnapshot.fullName": { $regex: search, $options: "i" } },
//       ];
//     }

//     // =========================
//     // FETCH DATA
//     // =========================
//     const orders = await B2BOrder.find(filter)
//       .populate("b2bUserId", "name email phone")
//       .sort({ [sortField]: sortOrder })
//       .skip(skip)
//       .limit(limit);

//     const totalOrders = await B2BOrder.countDocuments(filter);

//     // =========================
//     // RESPONSE
//     // =========================
//     return NextResponse.json({
//       success: true,
//       data: orders,
//       pagination: {
//         total: totalOrders,
//         page,
//         limit,
//         totalPages: Math.ceil(totalOrders / limit),
//       },
//     });
//   } catch (error: any) {
//     console.error("Orders API Error:", error);

//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }













// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import B2BOrder from "@/app/models/B2BOrder";
// import "@/app/models/b2bUsers"; // needed for populate

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     // =========================
//     // QUERY PARAMS
//     // =========================
//     const { searchParams } = new URL(req.url);

//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const status = searchParams.get("status"); // pending, delivered etc
//     const search = searchParams.get("search"); // orderId / name
//     const sortField = searchParams.get("sortField") || "createdAt";
//     const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

//     const skip = (page - 1) * limit;

//     // =========================
//     // FILTER BUILD
//     // =========================
//     const filter: any = {};

//     if (status && status !== "all") {
//       filter.status = status;
//     }

//     if (search) {
//       filter.$or = [
//         { orderId: { $regex: search, $options: "i" } },
//         { "addressSnapshot.fullName": { $regex: search, $options: "i" } },
//       ];
//     }

//     // =========================
//     // FETCH DATA
//     // =========================
//     const orders = await B2BOrder.find(filter)
//       .populate("b2bUserId", "name email phone")
//       .sort({ [sortField]: sortOrder })
//       .skip(skip)
//       .limit(limit);

//     const totalOrders = await B2BOrder.countDocuments(filter);

//     // =========================
//     // RESPONSE
//     // =========================
//     return NextResponse.json({
//       success: true,
//       data: orders,
//       pagination: {
//         total: totalOrders,
//         page,
//         limit,
//         totalPages: Math.ceil(totalOrders / limit),
//       },
//     });
//   } catch (error: any) {
//     console.error("Orders API Error:", error);

//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import B2BOrder from "@/app/models/B2BOrder";

// GET - Fetch orders (list or single)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    // If ID is provided, return single order
    if (id) {
      const order = await B2BOrder.findById(id);
      if (!order) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: order });
    }
    
    // Otherwise, return paginated list
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    if (status && status !== "all") filter.status = status;
    // if (search) {
    //   filter.$or = [
    //     { orderId: { $regex: search, $options: "i" } },
    //     { "addressSnapshot.fullName": { $regex: search, $options: "i" } },
    //   ];
    // }

    if (search) {
  filter.$or = [
    { orderId: { $regex: search, $options: "i" } },
    { "addressSnapshot.fullName": { $regex: search, $options: "i" } },
    { "paymentDetails.razorpayOrderId": { $regex: search, $options: "i" } },
    { "paymentDetails.razorpayPaymentId": { $regex: search, $options: "i" } },
  ];
}
    
    const orders = await B2BOrder.find(filter)
      .populate("b2bUserId", "name email phone")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await B2BOrder.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error: any) {
    console.error("Orders API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH - Update order
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }
    
    const body = await req.json();
    console.log("Updating order:", id);
    console.log("Update data:", body);
    
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // Update status if provided
    if (body.status) {
      updateData.status = body.status;
    }
    
    // Update address if provided
    if (body.addressSnapshot) {
      updateData["addressSnapshot.fullName"] = body.addressSnapshot.fullName;
      updateData["addressSnapshot.phoneNumber"] = body.addressSnapshot.phoneNumber;
      updateData["addressSnapshot.addressLine1"] = body.addressSnapshot.addressLine1;
      updateData["addressSnapshot.city"] = body.addressSnapshot.city;
      updateData["addressSnapshot.state"] = body.addressSnapshot.state;
      updateData["addressSnapshot.pincode"] = body.addressSnapshot.pincode;
    }
    
    const updatedOrder = await B2BOrder.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    
    // Add to status history if status was updated
    if (body.status) {
      await B2BOrder.findByIdAndUpdate(id, {
        $push: {
          statusHistory: {
            status: body.status,
            timestamp: new Date(),
            note: `Status updated to ${body.status}`,
            updatedBy: "Admin"
          }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully"
    });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete order
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }
    
    const deletedOrder = await B2BOrder.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete order error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}