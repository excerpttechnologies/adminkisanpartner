// // app/api/reports/order-payments/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/Db';
// import mongoose from 'mongoose';

// // Define a simple schema since we're using strict: false
// const OrderSchema = new mongoose.Schema({}, { 
//   timestamps: true, 
//   strict: false,
//   collection: "orders"
// });

// const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     // Get query parameters
//     const searchParams = request.nextUrl.searchParams;
//     const traderId = searchParams.get('traderId');
//     const orderId = searchParams.get('orderId');
//     const paymentStatus = searchParams.get('paymentStatus');
//     const startDate = searchParams.get('startDate');
//     const endDate = searchParams.get('endDate');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');
//     const skip = (page - 1) * limit;

//     // Build match conditions
//     const matchConditions: any = {};
    
//     if (traderId) matchConditions.traderId = traderId;
//     if (orderId) matchConditions.orderId = orderId;
//     if (paymentStatus) matchConditions['traderToAdminPayment.paymentStatus'] = paymentStatus;
    
//     // Date range filter
//     if (startDate || endDate) {
//       matchConditions.createdAt = {};
//       if (startDate) matchConditions.createdAt.$gte = new Date(startDate);
//       if (endDate) matchConditions.createdAt.$lte = new Date(endDate);
//     }

//     // Aggregation pipeline to get orders with EXACT fields you requested
//     const pipeline: any[] = [
//       // Match orders based on filters
//       ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
      
//       // Project ONLY the fields you specified
//       {
//         $project: {
//           // Basic order fields
//           orderId: 1,
//           traderId: 1,
//           traderName: 1,
          
//           // Trader to Admin Payment fields (EXACT fields you requested)
//           traderToAdminPayment: {
//             totalAmount: 1,
//             paidAmount: 1,
//             remainingAmount: 1,
//             paymentStatus: 1,
//             paymentHistory: {
//               $map: {
//                 input: "$traderToAdminPayment.paymentHistory",
//                 as: "payment",
//                 in: {
//                   amount: "$$payment.amount",
//                   paymentMethod: "$$payment.paymentMethod",
//                   paidDate: "$$payment.paidDate"
//                   // Only these 3 fields as you specified
//                 }
//               }
//             }
//           },
          
//           // Additional useful fields
//           createdAt: 1,
//           updatedAt: 1,
          
//           // Remove all other fields
//           _id: 0
//         }
//       },
      
//       // Sort by creation date (newest first)
//       { $sort: { createdAt: -1 } },
      
//       // Skip and limit for pagination
//       { $skip: skip },
//       { $limit: limit }
//     ];

//     console.log('Aggregation pipeline:', JSON.stringify(pipeline, null, 2));

//     // Execute query
//     const orders = await Order.aggregate(pipeline);
    
//     // Get total count
//     const countPipeline = [
//       ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
//       { $count: 'total' }
//     ];
    
//     const countResult = await Order.aggregate(countPipeline);
//     const total = countResult[0]?.total || 0;

//     // Calculate summary statistics
//     const summary = {
//       totalOrders: total,
//       totalAmount: orders.reduce((sum, order) => sum + (order.traderToAdminPayment?.totalAmount || 0), 0),
//       totalPaid: orders.reduce((sum, order) => sum + (order.traderToAdminPayment?.paidAmount || 0), 0),
//       totalRemaining: orders.reduce((sum, order) => sum + (order.traderToAdminPayment?.remainingAmount || 0), 0),
//       statusCounts: {
//         pending: orders.filter(o => o.traderToAdminPayment?.paymentStatus === 'pending').length,
//         partial: orders.filter(o => o.traderToAdminPayment?.paymentStatus === 'partial').length,
//         paid: orders.filter(o => o.traderToAdminPayment?.paymentStatus === 'paid').length
//       }
//     };

//     // Transform data to ensure all requested fields exist (even if null)
//     const transformedOrders = orders.map(order => ({
//       orderId: order.orderId || null,
//       traderId: order.traderId || null,
//       traderName: order.traderName || null,
//       traderToAdminPayment: {
//         totalAmount: order.traderToAdminPayment?.totalAmount || 0,
//         paidAmount: order.traderToAdminPayment?.paidAmount || 0,
//         remainingAmount: order.traderToAdminPayment?.remainingAmount || 0,
//         paymentStatus: order.traderToAdminPayment?.paymentStatus || 'pending',
//         paymentHistory: (order.traderToAdminPayment?.paymentHistory || []).map((payment: any) => ({
//           amount: payment.amount || 0,
//           paymentMethod: payment.paymentMethod || 'cash',
//           paidDate: payment.paidDate || null
//         }))
//       },
//       createdAt: order.createdAt || null,
//       updatedAt: order.updatedAt || null
//     }));

//     return NextResponse.json({
//       success: true,
//       data: transformedOrders,
//       summary,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       },
//       query: {
//         traderId,
//         orderId,
//         paymentStatus,
//         startDate,
//         endDate
//       }
//     });
    
//   } catch (error: any) {
//     console.error('Error fetching order payments:', error);
//     return NextResponse.json({
//       success: false,
//       message: 'Failed to fetch order payments',
//       error: error.message
//     }, { status: 500 });
//   }
// }









// app/api/reports/order-payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import mongoose from 'mongoose';

// Define a simple schema since we're using strict: false
const OrderSchema = new mongoose.Schema({}, { 
  timestamps: true, 
  strict: false,
  collection: "orders"
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const traderId = searchParams.get('traderId');
    const orderId = searchParams.get('orderId');
    const paymentStatus = searchParams.get('paymentStatus');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search'); // New search parameter
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build match conditions
    const matchConditions: any = {};
    
    if (traderId) matchConditions.traderId = traderId;
    if (orderId) matchConditions.orderId = orderId;
    if (paymentStatus) matchConditions['traderToAdminPayment.paymentStatus'] = paymentStatus;
    
    // Date range filter
    if (startDate || endDate) {
      matchConditions.createdAt = {};
      if (startDate) matchConditions.createdAt.$gte = new Date(startDate);
      if (endDate) matchConditions.createdAt.$lte = new Date(endDate);
    }

    // Build aggregation pipeline
    const pipeline: any[] = [];
    
    // Initial match for basic filters (if any)
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }
    
    // Apply search filter if search parameter exists
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      
      // Create a search stage using $or with regex on multiple fields
      const searchMatch: any = {
        $or: [
          { orderId: { $regex: searchRegex } },
          { traderId: { $regex: searchRegex } },
          { traderName: { $regex: searchRegex } },
          { 'traderToAdminPayment.paymentStatus': { $regex: searchRegex } },
          { 'traderToAdminPayment.paymentHistory.paymentMethod': { $regex: searchRegex } }
        ]
      };
      
      // For numeric fields, we need to check if they can be converted to string for regex search
      // We'll use $expr to handle this
      searchMatch.$or.push(
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$traderToAdminPayment.totalAmount" },
              regex: searchRegex
            }
          }
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$traderToAdminPayment.paidAmount" },
              regex: searchRegex
            }
          }
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$traderToAdminPayment.remainingAmount" },
              regex: searchRegex
            }
          }
        }
      );
      
      pipeline.push({ $match: searchMatch });
    }
    
    // Continue with the rest of the pipeline
    pipeline.push(
      // Project ONLY the fields you specified
      {
        $project: {
          // Basic order fields
          orderId: 1,
          traderId: 1,
          traderName: 1,
          
          // Trader to Admin Payment fields (EXACT fields you requested)
          traderToAdminPayment: {
            totalAmount: 1,
            paidAmount: 1,
            remainingAmount: 1,
            paymentStatus: 1,
            paymentHistory: {
              $map: {
                input: "$traderToAdminPayment.paymentHistory",
                as: "payment",
                in: {
                  amount: "$$payment.amount",
                  paymentMethod: "$$payment.paymentMethod",
                  paidDate: "$$payment.paidDate"
                }
              }
            }
          },
          
          // Additional useful fields
          createdAt: 1,
          updatedAt: 1,
          
          // Remove _id field only (you can exclude this)
          _id: 0
        }
      },
      
      // Sort by creation date (newest first)
      { $sort: { createdAt: -1 } },
      
      // Skip and limit for pagination
      { $skip: skip },
      { $limit: limit }
    );

    console.log('Aggregation pipeline:', JSON.stringify(pipeline, null, 2));

    // Execute query for data
    const orders = await Order.aggregate(pipeline);
    
    // Get total count with all filters applied
    const countPipeline: any[] = [];
    
    // Apply the same initial match conditions
    if (Object.keys(matchConditions).length > 0) {
      countPipeline.push({ $match: matchConditions });
    }
    
    // Apply search filter if exists for counting
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      
      const searchMatch: any = {
        $or: [
          { orderId: { $regex: searchRegex } },
          { traderId: { $regex: searchRegex } },
          { traderName: { $regex: searchRegex } },
          { 'traderToAdminPayment.paymentStatus': { $regex: searchRegex } },
          { 'traderToAdminPayment.paymentHistory.paymentMethod': { $regex: searchRegex } }
        ]
      };
      
      // For numeric fields in count pipeline
      searchMatch.$or.push(
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$traderToAdminPayment.totalAmount" },
              regex: searchRegex
            }
          }
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$traderToAdminPayment.paidAmount" },
              regex: searchRegex
            }
          }
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$traderToAdminPayment.remainingAmount" },
              regex: searchRegex
            }
          }
        }
      );
      
      countPipeline.push({ $match: searchMatch });
    }
    
    // Count the documents
    countPipeline.push({ $count: 'total' });
    
    const countResult = await Order.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Calculate summary statistics
    const summary = {
      totalOrders: total,
      totalAmount: orders.reduce((sum, order) => sum + (order.traderToAdminPayment?.totalAmount || 0), 0),
      totalPaid: orders.reduce((sum, order) => sum + (order.traderToAdminPayment?.paidAmount || 0), 0),
      totalRemaining: orders.reduce((sum, order) => sum + (order.traderToAdminPayment?.remainingAmount || 0), 0),
      statusCounts: {
        pending: orders.filter(o => o.traderToAdminPayment?.paymentStatus === 'pending').length,
        partial: orders.filter(o => o.traderToAdminPayment?.paymentStatus === 'partial').length,
        paid: orders.filter(o => o.traderToAdminPayment?.paymentStatus === 'paid').length
      }
    };

    // Transform data to ensure all requested fields exist (even if null)
    const transformedOrders = orders.map(order => ({
      orderId: order.orderId || null,
      traderId: order.traderId || null,
      traderName: order.traderName || null,
      traderToAdminPayment: {
        totalAmount: order.traderToAdminPayment?.totalAmount || 0,
        paidAmount: order.traderToAdminPayment?.paidAmount || 0,
        remainingAmount: order.traderToAdminPayment?.remainingAmount || 0,
        paymentStatus: order.traderToAdminPayment?.paymentStatus || 'pending',
        paymentHistory: (order.traderToAdminPayment?.paymentHistory || []).map((payment: any) => ({
          amount: payment.amount || 0,
          paymentMethod: payment.paymentMethod || 'cash',
          paidDate: payment.paidDate || null
        }))
      },
      createdAt: order.createdAt || null,
      updatedAt: order.updatedAt || null
    }));

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      summary,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      query: {
        traderId,
        orderId,
        paymentStatus,
        startDate,
        endDate,
        search // Include search parameter in response
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching order payments:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch order payments',
      error: error.message
    }, { status: 500 });
  }
}