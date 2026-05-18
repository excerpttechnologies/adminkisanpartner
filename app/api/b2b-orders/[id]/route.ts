// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";// Adjust this import based on your setup

// // PATCH - Update order
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     const updates = await req.json();
    
//     // Connect to your database
//     const { db } = await connectDB();
//     const collection = db.collection("orders"); // Adjust collection name
    
//     const result = await collection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { ...updates, updatedAt: new Date() } }
//     );
    
//     if (result.matchedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }
    
//     // Get updated order
//     const updatedOrder = await collection.findOne({ _id: new ObjectId(id) });
    
//     return NextResponse.json({
//       success: true,
//       data: updatedOrder,
//       message: "Order updated successfully"
//     });
//   } catch (error) {
//     console.error("Error updating order:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete order
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
    
//     const { db } = await connectToDatabase();
//     const collection = db.collection("orders");
    
//     const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: "Order deleted successfully"
//     });
//   } catch (error) {
//     console.error("Error deleting order:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }










// import "@/app/models/b2bUsers";

// // GET - Fetch single order
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = params;

//     const order = await B2BOrder.findById(id).populate("b2bUserId", "name email phone");

//     if (!order) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: order,
//     });
//   } catch (error: any) {
//     console.error("Fetch order error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PATCH - Update order
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const body = await request.json();

//     console.log("Updating order:", id);
//     console.log("Update data:", body);

//     // Remove any fields that shouldn't be updated directly
//     const updateData = { ...body };
    
//     // Add updated timestamp
//     updateData.updatedAt = new Date();

//     const updatedOrder = await B2BOrder.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     ).populate("b2bUserId", "name email phone");

//     if (!updatedOrder) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     // Add status history if status was updated
//     if (body.status) {
//       await B2BOrder.findByIdAndUpdate(id, {
//         $push: {
//           statusHistory: {
//             status: body.status,
//             timestamp: new Date(),
//             note: `Status updated to ${body.status}`,
//             updatedBy: "Admin"
//           }
//         }
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       data: updatedOrder,
//       message: "Order updated successfully"
//     });
//   } catch (error: any) {
//     console.error("Update order error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete order
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = params;

//     const deletedOrder = await B2BOrder.findByIdAndDelete(id);

//     if (!deletedOrder) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Order deleted successfully"
//     });
//   } catch (error: any) {
//     console.error("Delete order error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }







//   // Keep this as is
// // Remove this line if it's causing conflict:
// import { NextRequest, NextResponse } from "next/server";
// import  connectDB  from "@/app/lib/Db";
// import B2BOrder from "@/app/models/B2BOrder";

// // GET - Fetch single order
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = params;

//     const order = await B2BOrder.findById(id).populate("b2bUserId", "name email phone");

//     if (!order) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: order,
//     });
//   } catch (error: any) {
//     console.error("Fetch order error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PATCH - Update order status only
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const body = await request.json();

//     console.log("Updating order:", id);
//     console.log("Update data:", body);

//     // Only update the status field
//     const updatedOrder = await B2BOrder.findByIdAndUpdate(
//       id,
//       { 
//         $set: { 
//           status: body.status,
//           updatedAt: new Date()
//         },
//         $push: {
//           statusHistory: {
//             status: body.status,
//             timestamp: new Date(),
//             note: `Status updated to ${body.status}`,
//             updatedBy: "Admin"
//           }
//         }
//       },
//       { new: true, runValidators: true }
//     ).populate("b2bUserId", "name email phone");

//     if (!updatedOrder) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: updatedOrder,
//       message: "Order status updated successfully"
//     });
//   } catch (error: any) {
//     console.error("Update order error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete order
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = params;

//     const deletedOrder = await B2BOrder.findByIdAndDelete(id);

//     if (!deletedOrder) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Order deleted successfully"
//     });
//   } catch (error: any) {
//     console.error("Delete order error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }










import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import B2BOrder from "@/app/models/B2BOrder";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    
    const order = await B2BOrder.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: order
    });
  } catch (error: any) {
    console.error("GET order error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    
    console.log("PATCH request received for ID:", params.id);
    console.log("Update data:", body);
    
    // Update the order
    const updatedOrder = await B2BOrder.findByIdAndUpdate(
      id,
      { 
        $set: {
          status: body.status,
          "addressSnapshot.fullName": body.addressSnapshot?.fullName,
          "addressSnapshot.phoneNumber": body.addressSnapshot?.phoneNumber,
          "addressSnapshot.addressLine1": body.addressSnapshot?.addressLine1,
          "addressSnapshot.city": body.addressSnapshot?.city,
          "addressSnapshot.state": body.addressSnapshot?.state,
          "addressSnapshot.pincode": body.addressSnapshot?.pincode,
          updatedAt: new Date()
        },
        ...(body.status && {
          $push: {
            statusHistory: {
              status: body.status,
              timestamp: new Date(),
              note: `Status updated to ${body.status}`,
              updatedBy: "Admin"
            }
          }
        })
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedOrder,
      message: "Order updated successfully!"
    });
  } catch (error: any) {
    console.error("PATCH order error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    
    const deletedOrder = await B2BOrder.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Order deleted successfully!" 
    });
  } catch (error: any) {
    console.error("DELETE order error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}