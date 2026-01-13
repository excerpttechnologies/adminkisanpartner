

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import Product from '@/app/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get filter parameters
    const search = searchParams.get('search') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const purchaseType = searchParams.get('purchaseType') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    
    // Build match conditions
    const matchConditions: any = {
      'gradePrices.purchaseHistory.purchaseType': 'offer_accepted'
    };
    
    // Add additional filters if provided
    if (paymentStatus) {
      matchConditions['gradePrices.purchaseHistory.paymentStatus'] = paymentStatus;
    }
    
    if (purchaseType) {
      matchConditions['gradePrices.purchaseHistory.purchaseType'] = purchaseType;
    }
    
    if (dateFrom || dateTo) {
      matchConditions['gradePrices.purchaseHistory.purchaseDate'] = {};
      if (dateFrom) {
        matchConditions['gradePrices.purchaseHistory.purchaseDate'].$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        matchConditions['gradePrices.purchaseHistory.purchaseDate'].$lte = endDate;
      }
    }
    
    // Aggregation pipeline
    const pipeline: any[] = [
      // Match products with purchase history
      { $match: matchConditions },
      
      // Unwind gradePrices array
      { $unwind: '$gradePrices' },
      
      // Unwind purchaseHistory array
      { $unwind: '$gradePrices.purchaseHistory' },
      
      // Match only offer_accepted purchases
      { $match: { 'gradePrices.purchaseHistory.purchaseType': 'offer_accepted' } },
      
      // Apply search filter if provided
      ...(search ? [{
        $match: {
          $or: [
            { productId: { $regex: search, $options: 'i' } },
            { farmerId: { $regex: search, $options: 'i' } },
            { 'gradePrices.purchaseHistory.traderName': { $regex: search, $options: 'i' } },
            { 'gradePrices.purchaseHistory.traderId': { $regex: search, $options: 'i' } }
          ]
        }
      }] : []),
      
      // Project only the fields we need
      {
        $project: {
          productId: 1,
          farmerId: 1,
          traderId: '$gradePrices.purchaseHistory.traderId',
          traderName: '$gradePrices.purchaseHistory.traderName',
          quantity: '$gradePrices.purchaseHistory.quantity',
          pricePerUnit: '$gradePrices.purchaseHistory.pricePerUnit',
          totalAmount: '$gradePrices.purchaseHistory.totalAmount',
          purchaseType: '$gradePrices.purchaseHistory.purchaseType',
          paymentStatus: '$gradePrices.purchaseHistory.paymentStatus',
          purchaseDate: '$gradePrices.purchaseHistory.purchaseDate',
          orderCreated: '$gradePrices.purchaseHistory.orderCreated',
          orderId: '$gradePrices.purchaseHistory.orderId',
          grade: '$gradePrices.grade',
          createdAt: 1
        }
      },
      
      // Sort by purchase date (newest first)
      { $sort: { purchaseDate: -1 } },
      
      // Facet for pagination metadata
      {
        $facet: {
          metadata: [
            { $count: 'totalCount' }
          ],
          data: [
            { $skip: skip },
            { $limit: limit }
          ]
        }
      }
    ];
    
    const result = await Product.aggregate(pipeline);
    
    const data = result[0]?.data || [];
    const totalCount = result[0]?.metadata[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching farmer accept report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch report data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}