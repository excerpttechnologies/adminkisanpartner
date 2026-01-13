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
//     const orders: OrderResponse[] = await Order.find(query)
//       .select('orderId traderId traderName farmerId farmerName transporterDetails orderStatus createdAt updatedAt')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

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
//       data: orders,
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













// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from "@/app/lib/Db";
import Order from '@/app/models/Order';

// Define types
interface QueryParams {
  orderId?: string;
  traderId?: string;
  farmerId?: string;
  transporterId?: string;
  orderStatus?: string;
  page?: string;
  limit?: string;
}

interface MongoDBQuery {
  orderId?: { $regex: string; $options: string };
  traderId?: { $regex: string; $options: string };
  farmerId?: { $regex: string; $options: string };
  'transporterDetails.transporterId'?: { $regex: string; $options: string };
  orderStatus?: string;
}

interface OrderResponse {
  _id: string;
  orderId: string;
  traderId: string;
  traderName: string;
  traderMobile?: string;
  traderEmail?: string;
  farmerId: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerEmail?: string;
  transporterDetails?: {
    transporterId: string;
    transporterName: string;
    transporterMobile: string;
    vehicleNumber: string;
    vehicleType: string;
    driverName: string;
    pickupLocation: string;
    deliveryLocation: string;
    estimatedPickupDate?: Date;
    estimatedDeliveryDate?: Date;
    actualPickupDate?: Date;
    actualDeliveryDate?: Date;
  };
  orderStatus: 'pending' | 'processing' | 'in_transit' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  data: OrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary: {
    totalOrders: number;
    byStatus: {
      pending: number;
      processing: number;
      in_transit: number;
      completed: number;
      cancelled: number;
    };
    withTransporter: number;
  };
  timestamp: string;
  error?: string;
  message?: string;
}

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
//     const orders: OrderResponse[] = await Order.find(query)
//       .select('orderId traderId traderName farmerId farmerName transporterDetails orderStatus createdAt updatedAt')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean() 

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
//       data: orders,
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



export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const traderId = searchParams.get('traderId');
    const farmerId = searchParams.get('farmerId');
    const transporterId = searchParams.get('transporterId');
    const orderStatus = searchParams.get('orderStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query object
    const query: MongoDBQuery = {};
    
    if (orderId) {
      query.orderId = { $regex: orderId, $options: 'i' };
    }
    
    if (traderId) {
      query.traderId = { $regex: traderId, $options: 'i' };
    }
    
    if (farmerId) {
      query.farmerId = { $regex: farmerId, $options: 'i' };
    }
    
    if (transporterId) {
      query['transporterDetails.transporterId'] = { $regex: transporterId, $options: 'i' };
    }
    
    if (orderStatus) {
      // Validate order status
      const validStatuses = ['pending', 'processing', 'in_transit', 'completed', 'cancelled'];
      if (validStatuses.includes(orderStatus)) {
        query.orderStatus = orderStatus;
      }
    }

    console.log('Query:', query);

    // Fetch orders with selected fields only
    const orders = await Order.find(query)
      .select('orderId traderId traderName farmerId farmerName transporterDetails orderStatus createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform to match OrderResponse interface
    const transformedOrders: OrderResponse[] = orders.map(order => ({
      _id: order._id?.toString() || '',
      orderId: order.orderId || '',
      traderId: order.traderId || '',
      traderName: order.traderName || '',
      farmerId: order.farmerId || '',
      farmerName: order.farmerName || '',
      transporterDetails: order.transporterDetails,
      orderStatus: order.orderStatus || 'pending',
      createdAt: order.createdAt || new Date(),
      updatedAt: order.updatedAt || new Date()
    }));

    // Get total count for pagination
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get status counts in parallel for better performance
    const [pendingCount, processingCount, inTransitCount, completedCount, cancelledCount, withTransporterCount] = await Promise.all([
      Order.countDocuments({ ...query, orderStatus: 'pending' }),
      Order.countDocuments({ ...query, orderStatus: 'processing' }),
      Order.countDocuments({ ...query, orderStatus: 'in_transit' }),
      Order.countDocuments({ ...query, orderStatus: 'completed' }),
      Order.countDocuments({ ...query, orderStatus: 'cancelled' }),
      Order.countDocuments({
        ...query,
        'transporterDetails.transporterId': { $exists: true, $ne: null }
      })
    ]);

    // Format response
    const response: ApiResponse = {
      success: true,
      data: transformedOrders,
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
          pending: pendingCount,
          processing: processingCount,
          in_transit: inTransitCount,
          completed: completedCount,
          cancelled: cancelledCount,
        },
        withTransporter: withTransporterCount,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error fetching orders:', error);
    const errorResponse: Partial<ApiResponse> = {
      success: false,
      error: 'Failed to fetch orders',
      message: error.message,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}