





// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/Db';
// import mongoose from 'mongoose';

// // Define the Order schema
// const OrderSchema = new mongoose.Schema({}, {
//   strict: false,
//   timestamps: true,
//   collection: 'orders'
// });

// const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();

//     const params = request.nextUrl.searchParams;

//     // Get all query parameters
//     const traderId = params.get('traderId');
//     const orderId = params.get('orderId');
//     const search = params.get('search');
//     const startDate = params.get('startDate');
//     const endDate = params.get('endDate');
//     const paymentStatus = params.get('paymentStatus') || 'paid';

//     // Pagination and sorting
//     const page = Math.max(1, parseInt(params.get('page') || '1'));
//     const limit = Math.min(1000, Math.max(1, parseInt(params.get('limit') || '20')));
//     const sortBy = params.get('sortBy') || 'lastStatusChangeDate';
//     const sortOrder = params.get('order') === 'asc' ? 1 : -1;

//     const skip = (page - 1) * limit;

//     /* ---------- BUILD MATCH CONDITIONS ---------- */
//     const match: any = {};

//     // Add payment status filter - only filter if not 'all'
//     if (paymentStatus && paymentStatus !== 'all') {
//       match['traderToAdminPayment.paymentStatus'] = paymentStatus;
//     } else if (paymentStatus !== 'all') {
//       // Default to 'paid' if not specified
//       match['traderToAdminPayment.paymentStatus'] = 'paid';
//     }

//     // Additional filters
//     if (traderId && traderId.trim()) {
//       match.traderId = traderId.trim();
//     }

//     if (orderId && orderId.trim()) {
//       match.orderId = orderId.trim();
//     }

//     // Date range filter
//     if (startDate || endDate) {
//       match['traderToAdminPayment.lastStatusChangeDate'] = {};
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);
//         match['traderToAdminPayment.lastStatusChangeDate'].$gte = start;
//       }
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         match['traderToAdminPayment.lastStatusChangeDate'].$lte = end;
//       }
//     }

//     // Search filter
//     if (search && search.trim()) {
//       const searchRegex = { $regex: search.trim(), $options: 'i' };
//       match.$or = [
//         { traderName: searchRegex },
//         { orderId: searchRegex },
//         { traderId: searchRegex },
//         { farmerId: searchRegex } // Added farmerId to search
//       ];
//     }

//     /* ---------- DATA PIPELINE ---------- */
//     const dataPipeline: any[] = [
//       { $match: match },
//       {
//         $project: {
//           _id: 1, // Include _id for unique identification
//           orderId: 1,
//           traderId: 1,
//           traderName: 1,
//           farmerId: 1, // Added farmerId field
//           totalAmount: { 
//             $ifNull: ['$traderToAdminPayment.totalAmount', 0] 
//           },
//           paidAmount: { 
//             $ifNull: ['$traderToAdminPayment.paidAmount', 0] 
//           },
//           remainingAmount: { 
//             $ifNull: ['$traderToAdminPayment.remainingAmount', 0] 
//           },
//           paymentStatus: { 
//             $ifNull: ['$traderToAdminPayment.paymentStatus', 'unknown'] 
//           },
//           lastStatusChangeDate: { 
//             $ifNull: ['$traderToAdminPayment.lastStatusChangeDate', new Date()] 
//           },
//           createdAt: 1,
//           updatedAt: 1
//         }
//       },
//       { $sort: { [sortBy]: sortOrder } },
//       { $skip: skip },
//       { $limit: limit }
//     ];

//     /* ---------- COUNT PIPELINE ---------- */
//     const countPipeline: any[] = [
//       { $match: match },
//       { $count: 'total' }
//     ];

//     /* ---------- SUMMARY PIPELINE ---------- */
//     const summaryPipeline: any[] = [
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalClearedOrders: { $sum: 1 },
//           totalClearedAmount: { 
//             $sum: { $ifNull: ['$traderToAdminPayment.totalAmount', 0] } 
//           },
//           traders: { $addToSet: '$traderId' },
//           totalPaidAmount: {
//             $sum: { $ifNull: ['$traderToAdminPayment.paidAmount', 0] }
//           },
//           farmers: { $addToSet: '$farmerId' } // Added farmers count
//         }
//       }
//     ];

//     // Get current date for weekly/monthly calculations
//     const now = new Date();
//     const currentWeek = getWeekNumber(now);
//     const currentMonth = now.getMonth() + 1;
//     const currentYear = now.getFullYear();

//     /* ---------- WEEKLY/MONTHLY SUMMARY PIPELINE ---------- */
//     const timeBasedPipeline: any[] = [
//       { $match: match },
//       {
//         $addFields: {
//           lastStatusChangeDate: { 
//             $ifNull: ['$traderToAdminPayment.lastStatusChangeDate', new Date()] 
//           }
//         }
//       },
//       {
//         $addFields: {
//           weekNumber: { $week: '$lastStatusChangeDate' },
//           monthNumber: { $month: '$lastStatusChangeDate' },
//           yearNumber: { $year: '$lastStatusChangeDate' }
//         }
//       },
//       {
//         $facet: {
//           clearedThisWeek: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ['$yearNumber', currentYear] },
//                     { $eq: ['$weekNumber', currentWeek] }
//                   ]
//                 }
//               }
//             },
//             { $count: 'count' }
//           ],
//           clearedThisMonth: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ['$yearNumber', currentYear] },
//                     { $eq: ['$monthNumber', currentMonth] }
//                   ]
//                 }
//               }
//             },
//             { $count: 'count' }
//           ]
//         }
//       }
//     ];

//     // Execute all pipelines
//     const [data, countResult, summaryAgg, timeBasedAgg] = await Promise.all([
//       Order.aggregate(dataPipeline),
//       Order.aggregate(countPipeline),
//       Order.aggregate(summaryPipeline),
//       Order.aggregate(timeBasedPipeline)
//     ]);

//     const total = countResult[0]?.total || 0;
//     const summaryDoc = summaryAgg[0] || {};
//     const timeBasedDoc = timeBasedAgg[0] || {};

//     // Format the data with proper types
//     const formattedData = data.map((item: any) => ({
//       _id: item._id?.toString() || `${item.orderId}-${item.traderId}-${Date.now()}`,
//       orderId: item.orderId || '',
//       traderId: item.traderId || '',
//       traderName: item.traderName || 'Unknown Trader',
//       farmerId: item.farmerId || null, // Added farmerId to response
//       totalAmount: Number(item.totalAmount) || 0,
//       paidAmount: Number(item.paidAmount) || 0,
//       remainingAmount: Number(item.remainingAmount) || 0,
//       paymentStatus: item.paymentStatus || 'unknown',
//       lastStatusChangeDate: item.lastStatusChangeDate?.toISOString() || new Date().toISOString()
//     }));

//     // Calculate summary
//     const summary = {
//       totalClearedOrders: summaryDoc.totalClearedOrders || 0,
//       totalClearedAmount: summaryDoc.totalClearedAmount || 0,
//       averageClearedAmount: summaryDoc.totalClearedOrders
//         ? Number((summaryDoc.totalClearedAmount / summaryDoc.totalClearedOrders).toFixed(2))
//         : 0,
//       tradersCount: summaryDoc.traders?.length || 0,
//       farmersCount: summaryDoc.farmers?.length || 0, // Added farmers count to summary
//       clearedThisWeek: timeBasedDoc.clearedThisWeek?.[0]?.count || 0,
//       clearedThisMonth: timeBasedDoc.clearedThisMonth?.[0]?.count || 0,
//       totalPaidAmount: summaryDoc.totalPaidAmount || 0
//     };

//     const pagination = {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit) || 1
//     };

//     // Build response
//     const response = {
//       success: true,
//       reportName: 'TRADERS PAYMENT CLEARANCE REPORT',
//       reportDescription: 'Detailed report of trader payment clearance status and amounts',
//       data: formattedData,
//       summary,
//       pagination,
//       filtersApplied: {
//         paymentStatus,
//         traderId: traderId || null,
//         orderId: orderId || null,
//         startDate: startDate || null,
//         endDate: endDate || null,
//         search: search || null
//       },
//       timestamp: new Date().toISOString()
//     };

//     return NextResponse.json(response, { 
//       status: 200,
//       headers: {
//         'Cache-Control': 'no-store, max-age=0',
//         'Content-Type': 'application/json'
//       }
//     });

//   } catch (error: any) {
//     console.error('Error in payment clearance API:', error);
    
//     // Return safe error response
//     return NextResponse.json({
//       success: false,
//       message: 'Failed to fetch payment clearance report',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
//       data: [],
//       summary: {
//         totalClearedOrders: 0,
//         totalClearedAmount: 0,
//         averageClearedAmount: 0,
//         tradersCount: 0,
//         farmersCount: 0, // Added farmers count to error response
//         clearedThisWeek: 0,
//         clearedThisMonth: 0,
//         totalPaidAmount: 0
//       },
//       pagination: {
//         page: 1,
//         limit: 20,
//         total: 0,
//         totalPages: 1
//       },
//       timestamp: new Date().toISOString()
//     }, { 
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   }
// }

// // Helper function to get week number
// function getWeekNumber(date: Date): number {
//   const d = new Date(date);
//   d.setHours(0, 0, 0, 0);
//   d.setDate(d.getDate() + 4 - (d.getDay() || 7));
//   const yearStart = new Date(d.getFullYear(), 0, 1);
//   const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
//   return weekNo;
// }

















import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import mongoose from 'mongoose';
import Farmer from '@/app/models/Farmer';

// Define the Order schema
const OrderSchema = new mongoose.Schema({}, {
  strict: false,
  timestamps: true,
  collection: 'orders'
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const params = request.nextUrl.searchParams;

    // Get all query parameters
    const traderId = params.get('traderId');
    const orderId = params.get('orderId');
    const search = params.get('search');
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    const paymentStatus = params.get('paymentStatus') || 'paid';
    
    // NEW: State, District, Taluka filters
    const state = params.get('state');
    const district = params.get('district');
    const taluka = params.get('taluk');

    // Pagination and sorting
    const page = Math.max(1, parseInt(params.get('page') || '1'));
    const limit = Math.min(1000, Math.max(1, parseInt(params.get('limit') || '20')));
    const sortBy = params.get('sortBy') || 'lastStatusChangeDate';
    const sortOrder = params.get('order') === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Step 1: Get traders filtered by state, district, taluka
    let filteredTraderIds: string[] = [];
    
    if (state || district || taluka) {
      const traderFilter: any = { role: 'trader', isActive: true };
      
      if (state) traderFilter["personalInfo.state"] = state;
      if (district) traderFilter["personalInfo.district"] = district;
      if (taluka) traderFilter["personalInfo.taluk"] = taluka;
      
      const filteredTraders = await Farmer.find(traderFilter)
        .select('traderId')
        .lean();
      
      filteredTraderIds = filteredTraders.map(t => t.traderId).filter(Boolean);
      
      console.log(`Location filter: ${filteredTraderIds.length} traders found for state=${state}, district=${district}, taluka=${taluka}`);
    }

    /* ---------- BUILD MATCH CONDITIONS ---------- */
    const match: any = {};

    // Add payment status filter - only filter if not 'all'
    if (paymentStatus && paymentStatus !== 'all') {
      match['traderToAdminPayment.paymentStatus'] = paymentStatus;
    } else if (paymentStatus !== 'all') {
      // Default to 'paid' if not specified
      match['traderToAdminPayment.paymentStatus'] = 'paid';
    }

    // Trader ID filter
    if (traderId && traderId.trim()) {
      match.traderId = traderId.trim();
    } else if (filteredTraderIds.length > 0) {
      // Apply geographic filter if traderId is not specified
      match.traderId = { $in: filteredTraderIds };
    } else if (state || district || taluka) {
      // If geographic filter provided but no matching traders, return empty
      match.traderId = { $in: [] };
    }

    if (orderId && orderId.trim()) {
      match.orderId = orderId.trim();
    }

    // Date range filter
    if (startDate || endDate) {
      match['traderToAdminPayment.lastStatusChangeDate'] = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        match['traderToAdminPayment.lastStatusChangeDate'].$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match['traderToAdminPayment.lastStatusChangeDate'].$lte = end;
      }
    }

    // Search filter
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      match.$or = [
        { traderName: searchRegex },
        { orderId: searchRegex },
        { traderId: searchRegex },
        { farmerId: searchRegex }
      ];
    }

    /* ---------- DATA PIPELINE ---------- */
    const dataPipeline: any[] = [
      { $match: match },
      {
        $project: {
          _id: 1,
          orderId: 1,
          traderId: 1,
          traderName: 1,
          farmerId: 1,
          totalAmount: { 
            $ifNull: ['$traderToAdminPayment.totalAmount', 0] 
          },
          paidAmount: { 
            $ifNull: ['$traderToAdminPayment.paidAmount', 0] 
          },
          remainingAmount: { 
            $ifNull: ['$traderToAdminPayment.remainingAmount', 0] 
          },
          paymentStatus: { 
            $ifNull: ['$traderToAdminPayment.paymentStatus', 'unknown'] 
          },
          lastStatusChangeDate: { 
            $ifNull: ['$traderToAdminPayment.lastStatusChangeDate', new Date()] 
          },
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit }
    ];

    /* ---------- COUNT PIPELINE ---------- */
    const countPipeline: any[] = [
      { $match: match },
      { $count: 'total' }
    ];

    /* ---------- SUMMARY PIPELINE ---------- */
    const summaryPipeline: any[] = [
      { $match: match },
      {
        $group: {
          _id: null,
          totalClearedOrders: { $sum: 1 },
          totalClearedAmount: { 
            $sum: { $ifNull: ['$traderToAdminPayment.totalAmount', 0] } 
          },
          traders: { $addToSet: '$traderId' },
          totalPaidAmount: {
            $sum: { $ifNull: ['$traderToAdminPayment.paidAmount', 0] }
          },
          farmers: { $addToSet: '$farmerId' }
        }
      }
    ];

    // Get current date for weekly/monthly calculations
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    /* ---------- WEEKLY/MONTHLY SUMMARY PIPELINE ---------- */
    const timeBasedPipeline: any[] = [
      { $match: match },
      {
        $addFields: {
          lastStatusChangeDate: { 
            $ifNull: ['$traderToAdminPayment.lastStatusChangeDate', new Date()] 
          }
        }
      },
      {
        $addFields: {
          weekNumber: { $week: '$lastStatusChangeDate' },
          monthNumber: { $month: '$lastStatusChangeDate' },
          yearNumber: { $year: '$lastStatusChangeDate' }
        }
      },
      {
        $facet: {
          clearedThisWeek: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$yearNumber', currentYear] },
                    { $eq: ['$weekNumber', currentWeek] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          clearedThisMonth: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$yearNumber', currentYear] },
                    { $eq: ['$monthNumber', currentMonth] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ];

    // Execute all pipelines
    const [data, countResult, summaryAgg, timeBasedAgg] = await Promise.all([
      Order.aggregate(dataPipeline),
      Order.aggregate(countPipeline),
      Order.aggregate(summaryPipeline),
      Order.aggregate(timeBasedPipeline)
    ]);

    const total = countResult[0]?.total || 0;
    const summaryDoc = summaryAgg[0] || {};
    const timeBasedDoc = timeBasedAgg[0] || {};

    // Step 2: Fetch trader details for all unique traderIds
    const uniqueTraderIds = [...new Set(data.map((item: any) => item.traderId).filter(Boolean))];
    
    let tradersMap = new Map();
    if (uniqueTraderIds.length > 0) {
      const traders = await Farmer.find({
        $or: [
          { traderId: { $in: uniqueTraderIds } },
          { farmerId: { $in: uniqueTraderIds } }
        ],
        role: 'trader'
      }).lean();
      
      traders.forEach(trader => {
        const id = trader.traderId || trader.farmerId;
        if (id) {
          tradersMap.set(id, {
            // Basic info
            traderId: trader.traderId,
            farmerId: trader.farmerId,
            role: trader.role,
            registrationStatus: trader.registrationStatus,
            isActive: trader.isActive,
            
            // Personal info
            personalInfo: trader.personalInfo || {},
            
            // Bank details
            bankDetails: trader.bankDetails || {},
            
            // Arrays
            commodities: trader.commodities || [],
            nearestMarkets: trader.nearestMarkets || [],
            subcategories: trader.subcategories || [],
            
            // Timestamps
            registeredAt: trader.registeredAt,
            updatedAt: trader.updatedAt,
            
            // Geographic fields for easy access
            state: trader.personalInfo?.state,
            district: trader.personalInfo?.district,
            taluk: trader.personalInfo?.taluk,
            mobileNo: trader.personalInfo?.mobileNo,
            email: trader.personalInfo?.email,
            address: trader.personalInfo?.address,
            pincode: trader.personalInfo?.pincode,
            villageGramaPanchayat: trader.personalInfo?.villageGramaPanchayat
          });
        }
      });
    }

    // Format the data with proper types and trader details
    const formattedData = data.map((item: any) => {
      // Get trader details
      const traderDetails = item.traderId && tradersMap.has(item.traderId) 
        ? tradersMap.get(item.traderId) 
        : null;
      
      // Check if trader matches geographic filters (if any)
      let passesGeographicFilter = true;
      if (state && traderDetails?.state !== state) passesGeographicFilter = false;
      if (district && traderDetails?.district !== district) passesGeographicFilter = false;
      if (taluka && traderDetails?.taluk !== taluka) passesGeographicFilter = false;
      
      // Skip if doesn't pass geographic filter
      if (!passesGeographicFilter) return null;
      
      return {
        _id: item._id?.toString() || `${item.orderId}-${item.traderId}-${Date.now()}`,
        orderId: item.orderId || '',
        traderId: item.traderId || '',
        traderName: item.traderName || 'Unknown Trader',
        farmerId: item.farmerId || null,
        totalAmount: Number(item.totalAmount) || 0,
        paidAmount: Number(item.paidAmount) || 0,
        remainingAmount: Number(item.remainingAmount) || 0,
        paymentStatus: item.paymentStatus || 'unknown',
        lastStatusChangeDate: item.lastStatusChangeDate?.toISOString() || new Date().toISOString(),
        
        // Trader details
        traderDetails: traderDetails ? {
          // Basic info
          traderId: traderDetails.traderId,
          farmerId: traderDetails.farmerId,
          role: traderDetails.role,
          registrationStatus: traderDetails.registrationStatus,
          isActive: traderDetails.isActive,
          
          // Personal info
          personalInfo: traderDetails.personalInfo,
          
          // Bank details
          bankDetails: traderDetails.bankDetails,
          
          // Arrays
          commodities: traderDetails.commodities,
          nearestMarkets: traderDetails.nearestMarkets,
          subcategories: traderDetails.subcategories,
          
          // Timestamps
          registeredAt: traderDetails.registeredAt,
          updatedAt: traderDetails.updatedAt,
          
          // Geographic fields
          state: traderDetails.state,
          district: traderDetails.district,
          taluk: traderDetails.taluk,
          mobileNo: traderDetails.mobileNo,
          email: traderDetails.email,
          address: traderDetails.address,
          pincode: traderDetails.pincode,
          villageGramaPanchayat: traderDetails.villageGramaPanchayat
        } : null
      };
    }).filter(Boolean); // Remove null entries

    // Calculate summary
    const summary = {
      totalClearedOrders: summaryDoc.totalClearedOrders || 0,
      totalClearedAmount: summaryDoc.totalClearedAmount || 0,
      averageClearedAmount: summaryDoc.totalClearedOrders
        ? Number((summaryDoc.totalClearedAmount / summaryDoc.totalClearedOrders).toFixed(2))
        : 0,
      tradersCount: summaryDoc.traders?.length || 0,
      farmersCount: summaryDoc.farmers?.length || 0,
      clearedThisWeek: timeBasedDoc.clearedThisWeek?.[0]?.count || 0,
      clearedThisMonth: timeBasedDoc.clearedThisMonth?.[0]?.count || 0,
      totalPaidAmount: summaryDoc.totalPaidAmount || 0
    };

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    };

    // Get filter options for state, district, taluka
    let stateOptions: string[] = [];
    let districtOptions: string[] = [];
    let talukaOptions: string[] = [];
    
    // Get all traders with cleared payments
    const tradersWithPayments = await Order.distinct('traderId', match);
    
    if (tradersWithPayments.length > 0) {
      // Get unique states from these traders
      const traderDetails = await Farmer.find({ 
        $or: [
          { traderId: { $in: tradersWithPayments } },
          { farmerId: { $in: tradersWithPayments } }
        ],
        role: 'trader',
        isActive: true,
        "personalInfo.state": { $exists: true, $ne: "" }
      }).select('personalInfo.state personalInfo.district personalInfo.taluk').lean();
      
      stateOptions = [...new Set(traderDetails
        .map(t => t.personalInfo?.state)
        .filter(Boolean))].sort();
      
      // Get districts based on selected state
      if (state) {
        districtOptions = [...new Set(traderDetails
          .filter(t => t.personalInfo?.state === state)
          .map(t => t.personalInfo?.district)
          .filter(Boolean))].sort();
      }
      
      // Get taluks based on selected district
      if (district) {
        talukaOptions = [...new Set(traderDetails
          .filter(t => t.personalInfo?.district === district)
          .map(t => t.personalInfo?.taluk)
          .filter(Boolean))].sort();
      }
    }

    // Build response
    const response = {
      success: true,
      reportName: 'TRADERS PAYMENT CLEARANCE REPORT',
      reportDescription: 'Detailed report of trader payment clearance status and amounts',
      data: formattedData,
      summary,
      pagination,
      filters: {
        geographic: {
          states: stateOptions,
          districts: districtOptions,
          taluks: talukaOptions
        },
        applied: {
          state,
          district,
          taluka
        }
      },
      filtersApplied: {
        paymentStatus,
        traderId: traderId || null,
        orderId: orderId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error('Error in payment clearance API:', error);
    
    // Return safe error response
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch payment clearance report',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      data: [],
      summary: {
        totalClearedOrders: 0,
        totalClearedAmount: 0,
        averageClearedAmount: 0,
        tradersCount: 0,
        farmersCount: 0,
        clearedThisWeek: 0,
        clearedThisMonth: 0,
        totalPaidAmount: 0
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
      },
      filters: {
        geographic: {
          states: [],
          districts: [],
          taluks: []
        },
        applied: {
          state: '',
          district: '',
          taluka: ''
        }
      },
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo;
}


