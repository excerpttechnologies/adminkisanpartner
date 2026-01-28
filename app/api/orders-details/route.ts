










// // app/api/orders/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from "@/app/lib/Db";
// import Order from '@/app/models/Order';

// // Define types
// interface QueryParams {
//   orderId?: string;
//   traderId?: string;
//   farmerId?: string;
//   transporterId?: string;
//   orderStatus?: string;
//   page?: string;
//   limit?: string;
// }

// interface MongoDBQuery {
//   orderId?: { $regex: string; $options: string };
//   traderId?: { $regex: string; $options: string };
//   farmerId?: { $regex: string; $options: string };
//   'transporterDetails.transporterId'?: { $regex: string; $options: string };
//   orderStatus?: string;
// }

// interface OrderResponse {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   traderMobile?: string;
//   traderEmail?: string;
//   farmerId: string;
//   farmerName?: string;
//   farmerMobile?: string;
//   farmerEmail?: string;
//   transporterDetails?: {
//     transporterId: string;
//     transporterName: string;
//     transporterMobile: string;
//     vehicleNumber: string;
//     vehicleType: string;
//     driverName: string;
//     pickupLocation: string;
//     deliveryLocation: string;
//     estimatedPickupDate?: Date;
//     estimatedDeliveryDate?: Date;
//     actualPickupDate?: Date;
//     actualDeliveryDate?: Date;
//   };
//   orderStatus: 'pending' | 'processing' | 'in_transit' | 'completed' | 'cancelled';
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface ApiResponse {
//   success: boolean;
//   data: OrderResponse[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
//   summary: {
//     totalOrders: number;
//     byStatus: {
//       pending: number;
//       processing: number;
//       in_transit: number;
//       completed: number;
//       cancelled: number;
//     };
//     withTransporter: number;
//   };
//   timestamp: string;
//   error?: string;
//   message?: string;
// }

// // export async function GET(request: NextRequest) {
// //   try {
// //     await connectDB();
    
// //     // Get query parameters
// //     const searchParams = request.nextUrl.searchParams;
// //     const orderId = searchParams.get('orderId');
// //     const traderId = searchParams.get('traderId');
// //     const farmerId = searchParams.get('farmerId');
// //     const transporterId = searchParams.get('transporterId');
// //     const orderStatus = searchParams.get('orderStatus');
// //     const page = parseInt(searchParams.get('page') || '1');
// //     const limit = parseInt(searchParams.get('limit') || '20');
// //     const skip = (page - 1) * limit;

// //     // Build query object
// //     const query: MongoDBQuery = {};
    
// //     if (orderId) {
// //       query.orderId = { $regex: orderId, $options: 'i' };
// //     }
    
// //     if (traderId) {
// //       query.traderId = { $regex: traderId, $options: 'i' };
// //     }
    
// //     if (farmerId) {
// //       query.farmerId = { $regex: farmerId, $options: 'i' };
// //     }
    
// //     if (transporterId) {
// //       query['transporterDetails.transporterId'] = { $regex: transporterId, $options: 'i' };
// //     }
    
// //     if (orderStatus) {
// //       // Validate order status
// //       const validStatuses = ['pending', 'processing', 'in_transit', 'completed', 'cancelled'];
// //       if (validStatuses.includes(orderStatus)) {
// //         query.orderStatus = orderStatus;
// //       }
// //     }

// //     console.log('Query:', query);

// //     // Fetch orders with selected fields only
// //     const orders: OrderResponse[] = await Order.find(query)
// //       .select('orderId traderId traderName farmerId farmerName transporterDetails orderStatus createdAt updatedAt')
// //       .sort({ createdAt: -1 })
// //       .skip(skip)
// //       .limit(limit)
// //       .lean() 

// //     // Get total count for pagination
// //     const total = await Order.countDocuments(query);
// //     const totalPages = Math.ceil(total / limit);

// //     // Get status counts in parallel for better performance
// //     const [pendingCount, processingCount, inTransitCount, completedCount, cancelledCount, withTransporterCount] = await Promise.all([
// //       Order.countDocuments({ ...query, orderStatus: 'pending' }),
// //       Order.countDocuments({ ...query, orderStatus: 'processing' }),
// //       Order.countDocuments({ ...query, orderStatus: 'in_transit' }),
// //       Order.countDocuments({ ...query, orderStatus: 'completed' }),
// //       Order.countDocuments({ ...query, orderStatus: 'cancelled' }),
// //       Order.countDocuments({
// //         ...query,
// //         'transporterDetails.transporterId': { $exists: true, $ne: null }
// //       })
// //     ]);

// //     // Format response
// //     const response: ApiResponse = {
// //       success: true,
// //       data: orders,
// //       pagination: {
// //         page,
// //         limit,
// //         total,
// //         totalPages,
// //         hasNextPage: page < totalPages,
// //         hasPrevPage: page > 1,
// //       },
// //       summary: {
// //         totalOrders: total,
// //         byStatus: {
// //           pending: pendingCount,
// //           processing: processingCount,
// //           in_transit: inTransitCount,
// //           completed: completedCount,
// //           cancelled: cancelledCount,
// //         },
// //         withTransporter: withTransporterCount,
// //       },
// //       timestamp: new Date().toISOString(),
// //     };

// //     return NextResponse.json(response);

// //   } catch (error: any) {
// //     console.error('Error fetching orders:', error);
// //     const errorResponse: Partial<ApiResponse> = {
// //       success: false,
// //       error: 'Failed to fetch orders',
// //       message: error.message,
// //       timestamp: new Date().toISOString(),
// //     };
    
// //     return NextResponse.json(errorResponse, { status: 500 });
// //   }
// // }



// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     // Get query parameters
//     const searchParams = request.nextUrl.searchParams;
//     const orderId = searchParams.get('orderId');
//     const traderId = searchParams.get('traderId');
//     const farmerId = searchParams.get('farmerId');
//     const transporterId = searchParams.get('transporterId');
//     const orderStatus = searchParams.get('orderStatus');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');
//     const skip = (page - 1) * limit;

//     // Build query object
//     const query: MongoDBQuery = {};
    
//     if (orderId) {
//       query.orderId = { $regex: orderId, $options: 'i' };
//     }
    
//     if (traderId) {
//       query.traderId = { $regex: traderId, $options: 'i' };
//     }
    
//     if (farmerId) {
//       query.farmerId = { $regex: farmerId, $options: 'i' };
//     }
    
//     if (transporterId) {
//       query['transporterDetails.transporterId'] = { $regex: transporterId, $options: 'i' };
//     }
    
//     if (orderStatus) {
//       // Validate order status
//       const validStatuses = ['pending', 'processing', 'in_transit', 'completed', 'cancelled'];
//       if (validStatuses.includes(orderStatus)) {
//         query.orderStatus = orderStatus;
//       }
//     }

//     console.log('Query:', query);

//     // Fetch orders with selected fields only
//     const orders = await Order.find(query)
//       .select('orderId traderId traderName farmerId farmerName transporterDetails orderStatus createdAt updatedAt')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Transform to match OrderResponse interface
//     const transformedOrders: OrderResponse[] = orders.map(order => ({
//       _id: order._id?.toString() || '',
//       orderId: order.orderId || '',
//       traderId: order.traderId || '',
//       traderName: order.traderName || '',
//       farmerId: order.farmerId || '',
//       farmerName: order.farmerName || '',
//       transporterDetails: order.transporterDetails,
//       orderStatus: order.orderStatus || 'pending',
//       createdAt: order.createdAt || new Date(),
//       updatedAt: order.updatedAt || new Date()
//     }));

//     // Get total count for pagination
//     const total = await Order.countDocuments(query);
//     const totalPages = Math.ceil(total / limit);

//     // Get status counts in parallel for better performance
//     const [pendingCount, processingCount, inTransitCount, completedCount, cancelledCount, withTransporterCount] = await Promise.all([
//       Order.countDocuments({ ...query, orderStatus: 'pending' }),
//       Order.countDocuments({ ...query, orderStatus: 'processing' }),
//       Order.countDocuments({ ...query, orderStatus: 'in_transit' }),
//       Order.countDocuments({ ...query, orderStatus: 'completed' }),
//       Order.countDocuments({ ...query, orderStatus: 'cancelled' }),
//       Order.countDocuments({
//         ...query,
//         'transporterDetails.transporterId': { $exists: true, $ne: null }
//       })
//     ]);

//     // Format response
//     const response: ApiResponse = {
//       success: true,
//       data: transformedOrders,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1,
//       },
//       summary: {
//         totalOrders: total,
//         byStatus: {
//           pending: pendingCount,
//           processing: processingCount,
//           in_transit: inTransitCount,
//           completed: completedCount,
//           cancelled: cancelledCount,
//         },
//         withTransporter: withTransporterCount,
//       },
//       timestamp: new Date().toISOString(),
//     };

//     return NextResponse.json(response);

//   } catch (error: any) {
//     console.error('Error fetching orders:', error);
//     const errorResponse: Partial<ApiResponse> = {
//       success: false,
//       error: 'Failed to fetch orders',
//       message: error.message,
//       timestamp: new Date().toISOString(),
//     };
    
//     return NextResponse.json(errorResponse, { status: 500 });
//   }
// }









import connectDB from "@/app/lib/Db";
import Farmer from "@/app/models/Farmer";
import Order from "@/app/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // ===============================
    // QUERY PARAMS
    // ===============================
    const search = searchParams.get("search") || "";
    const taluk = searchParams.get("taluk") || "";
    const orderStatus = searchParams.get("orderStatus") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const transporterStatus = searchParams.get("transporterStatus") || "";
    const date = searchParams.get("date") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const skip = (page - 1) * limit;

    // ===============================
    // BASE FILTER
    // ===============================
    const baseFilter: any = {};

    if (orderStatus && orderStatus !== "All") {
      baseFilter.orderStatus = orderStatus;
    }

    if (paymentStatus && paymentStatus !== "All") {
      baseFilter["traderToAdminPayment.paymentStatus"] = paymentStatus;
    }

    if (transporterStatus && transporterStatus !== "All") {
      baseFilter.transporterStatus = transporterStatus;
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      baseFilter.createdAt = { $gte: start, $lte: end };
    }

    // ===============================
    // TALUK FILTER (farmer + trader)
    // ===============================
    let talukCondition: any = null;

    if (taluk && taluk !== "All") {
      const usersInTaluk = await Farmer.find(
        {
          "personalInfo.taluk": { $regex: new RegExp(`^${taluk}$`, "i") },
          $or: [{ role: "farmer" }, { role: "trader" }],
        },
        { farmerId: 1, traderId: 1, role: 1 }
      ).lean();

      const farmerIds = usersInTaluk
        .filter(u => u.role === "farmer")
        .map(u => u.farmerId)
        .filter(Boolean);

      const traderIds = usersInTaluk
        .filter(u => u.role === "trader")
        .map(u => u.traderId)
        .filter(Boolean);

      if (!farmerIds.length && !traderIds.length) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
          summary: {
            totalOrders: 0,
            byStatus: {
              pending: 0,
              processing: 0,
              in_transit: 0,
              completed: 0,
              cancelled: 0,
            },
          },
        });
      }

      talukCondition = {
        $or: [
          farmerIds.length ? { farmerId: { $in: farmerIds } } : null,
          traderIds.length ? { traderId: { $in: traderIds } } : null,
        ].filter(Boolean),
      };
    }

    // ===============================
    // SEARCH FILTER
    // ===============================
    const searchCondition = search
      ? {
          $or: [
            { orderId: { $regex: search, $options: "i" } },
            { farmerId: { $regex: search, $options: "i" } },
            { farmerName: { $regex: search, $options: "i" } },
            { traderId: { $regex: search, $options: "i" } },
            { traderName: { $regex: search, $options: "i" } },
            { "transporterDetails.transporterName": { $regex: search, $options: "i" } },
            { "productItems.productName": { $regex: search, $options: "i" } },
            { "productItems.categoryName": { $regex: search, $options: "i" } },
          ],
        }
      : null;

    // ===============================
    // FINAL FILTER
    // ===============================
    const finalFilter: any = { ...baseFilter };
    const andConditions: any[] = [];

    if (talukCondition) andConditions.push(talukCondition);
    if (searchCondition) andConditions.push(searchCondition);

    if (andConditions.length) {
      finalFilter.$and = andConditions;
    }

    // ===============================
    // PAGINATION CORE
    // ===============================
    const total = await Order.countDocuments(finalFilter);
    const totalPages = Math.ceil(total / limit);

    const orders = await Order.find(finalFilter)
      .select("+productItems")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // ===============================
    // FETCH farmerDetails & traderDetails
    // ===============================
    const farmerIdsFromOrders = [...new Set(orders.map(o => o.farmerId).filter(Boolean))];
    const traderIdsFromOrders = [...new Set(orders.map(o => o.traderId).filter(Boolean))];

    const [farmers, traders] = await Promise.all([
      farmerIdsFromOrders.length
        ? Farmer.find(
            { farmerId: { $in: farmerIdsFromOrders } },
            { farmerId: 1, personalInfo: 1, role: 1, registrationStatus: 1, isActive: 1 }
          ).lean()
        : [],
      traderIdsFromOrders.length
        ? Farmer.find(
            { traderId: { $in: traderIdsFromOrders } },
            { traderId: 1, personalInfo: 1, role: 1, registrationStatus: 1, isActive: 1 }
          ).lean()
        : [],
    ]);

    const farmerMap = new Map(
      farmers.map(f => [
        f.farmerId,
        {
          farmerId: f.farmerId,
          personalInfo: f.personalInfo,
          role: f.role,
          registrationStatus: f.registrationStatus,
          isActive: f.isActive,
        },
      ])
    );

    const traderMap = new Map(
      traders.map(t => [
        t.traderId,
        {
          traderId: t.traderId,
          personalInfo: t.personalInfo,
          role: t.role,
          registrationStatus: t.registrationStatus,
          isActive: t.isActive,
        },
      ])
    );

    // ===============================
    // ATTACH DETAILS TO ORDERS
    // ===============================
    const processedOrders = orders.map(order => ({
      ...order,
      farmerDetails: order.farmerId ? farmerMap.get(order.farmerId) || null : null,
      traderDetails: order.traderId ? traderMap.get(order.traderId) || null : null,
    }));

    // ===============================
    // STATUS COUNTS
    // ===============================
    const statuses = ["pending", "processing", "in_transit", "completed", "cancelled"];
    const counts = await Promise.all(
      statuses.map(s =>
        Order.countDocuments({
          $and: [finalFilter, { orderStatus: s }],
        })
      )
    );

    // ===============================
    // FINAL RESPONSE ✅
    // ===============================
    return NextResponse.json({
      success: true,
      data: processedOrders,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },

      summary: {
        totalOrders: total,
        byStatus: {
          pending: counts[0],
          processing: counts[1],
          in_transit: counts[2],
          completed: counts[3],
          cancelled: counts[4],
        },
      },

      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders", error: (error as Error).message },
      { status: 500 }
    );
  }
}
