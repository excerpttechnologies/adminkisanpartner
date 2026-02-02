





import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import mongoose from 'mongoose';
import Farmer from '@/app/models/Farmer';

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
    const search = searchParams.get('search');
    
    // NEW: State, District, Taluka filters
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const taluka = searchParams.get('taluk');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
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

    // Build match conditions for orders
    const matchConditions: any = {};
    
    if (traderId) {
      matchConditions.traderId = traderId;
    } else if (filteredTraderIds.length > 0) {
      // Apply geographic filter if traderId is not specified
      matchConditions.traderId = { $in: filteredTraderIds };
    } else if (state || district || taluka) {
      // If geographic filter provided but no matching traders, return empty
      matchConditions.traderId = { $in: [] };
    }
    
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
          { 'traderToAdminPayment.paymentHistory.paymentMethod': { $regex: searchRegex } },
          { farmerId: { $regex: searchRegex } },
          // Also search in farmer name if available in the order document
          { farmerName: { $regex: searchRegex } }
        ]
      };
      
      // For numeric fields
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
    
    // Lookup trader details from Farmer collection
    pipeline.push(
      {
        $lookup: {
          from: 'farmers',
          let: { orderTraderId: '$traderId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$traderId', '$$orderTraderId'] },
                    { $eq: ['$farmerId', '$$orderTraderId'] }
                  ]
                }
              }
            },
            {
              $project: {
                // Trader details
                traderId: 1,
                farmerId: 1,
                role: 1,
                personalInfo: 1,
                bankDetails: 1,
                registrationStatus: 1,
                isActive: 1,
                commodities: 1,
                nearestMarkets: 1,
                subcategories: 1,
                registeredAt: 1,
                updatedAt: 1,
                
                // Geographic fields for easy access
                state: '$personalInfo.state',
                district: '$personalInfo.district',
                taluk: '$personalInfo.taluk',
                mobileNo: '$personalInfo.mobileNo',
                email: '$personalInfo.email',
                address: '$personalInfo.address'
              }
            }
          ],
          as: 'traderDetails'
        }
      },
      
      // Add trader details to each order
      {
        $addFields: {
          traderDetails: { $arrayElemAt: ['$traderDetails', 0] }
        }
      },
      
      // Filter by geographic criteria again (in case lookup brought in wrong traders)
      ...(state || district || taluka ? [
        {
          $match: {
            ...(state ? { 'traderDetails.state': state } : {}),
            ...(district ? { 'traderDetails.district': district } : {}),
            ...(taluka ? { 'traderDetails.taluk': taluka } : {})
          }
        }
      ] : []),
      
      // Project ONLY the fields you specified
      {
        $project: {
          // Basic order fields
          orderId: 1,
          traderId: 1,
          traderName: 1,
          farmerId: 1,
          
          // Trader details
          traderDetails: 1,
          
          // Trader to Admin Payment fields
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
          { 'traderToAdminPayment.paymentHistory.paymentMethod': { $regex: searchRegex } },
          { farmerId: { $regex: searchRegex } }
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

    // Get unique trader IDs for fetching filter options
    const uniqueTraderIds = [...new Set(orders.map(o => o.traderId).filter(Boolean))];
    
    // Get filter options for state, district, taluka
    let stateOptions: string[] = [];
    let districtOptions: string[] = [];
    let talukaOptions: string[] = [];
    
    // Get all traders with orders
    const tradersWithOrders = await Order.distinct('traderId', matchConditions);
    
    if (tradersWithOrders.length > 0) {
      // Get unique states from these traders
      const traderDetails = await Farmer.find({ 
        $or: [
          { traderId: { $in: tradersWithOrders } },
          { farmerId: { $in: tradersWithOrders } }
        ],
        role: 'trader',
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

    // Transform data to ensure all requested fields exist (even if null)
    const transformedOrders = orders.map(order => ({
      orderId: order.orderId || null,
      traderId: order.traderId || null,
      traderName: order.traderName || null,
      farmerId: order.farmerId || null,
      
      // Trader details
      traderDetails: order.traderDetails ? {
        // Basic info
        traderId: order.traderDetails.traderId || null,
        farmerId: order.traderDetails.farmerId || null,
        role: order.traderDetails.role || null,
        registrationStatus: order.traderDetails.registrationStatus || null,
        isActive: order.traderDetails.isActive || false,
        
        // Personal info
        personalInfo: order.traderDetails.personalInfo || {},
        
        // Bank details
        bankDetails: order.traderDetails.bankDetails || {},
        
        // Arrays
        commodities: order.traderDetails.commodities || [],
        nearestMarkets: order.traderDetails.nearestMarkets || [],
        subcategories: order.traderDetails.subcategories || [],
        
        // Timestamps
        registeredAt: order.traderDetails.registeredAt || null,
        updatedAt: order.traderDetails.updatedAt || null,
        
        // Geographic fields
        state: order.traderDetails.state || order.traderDetails.personalInfo?.state || null,
        district: order.traderDetails.district || order.traderDetails.personalInfo?.district || null,
        taluk: order.traderDetails.taluk || order.traderDetails.personalInfo?.taluk || null,
        mobileNo: order.traderDetails.mobileNo || order.traderDetails.personalInfo?.mobileNo || null,
        email: order.traderDetails.email || order.traderDetails.personalInfo?.email || null,
        address: order.traderDetails.address || order.traderDetails.personalInfo?.address || null
      } : null,
      
      // Payment info
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
      
      // Timestamps
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
      query: {
        traderId,
        orderId,
        paymentStatus,
        startDate,
        endDate,
        search
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