import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Product from '@/app/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const traderId = searchParams.get('traderId');
    const farmerId = searchParams.get('farmerId');
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Since we don't know the exact schema structure,
    // we'll use a flexible aggregation approach
    
    // First, let's see what the data looks like
    const sampleProduct = await Product.findOne({
      $or: [
        { 'offers': { $exists: true } },
        { 'gradePrices.offers': { $exists: true } },
        { 'bids': { $exists: true } }
      ]
    }).lean();
    
    console.log('Sample product structure:', Object.keys(sampleProduct || {}));
    
    // Based on your team's schema, offers could be in different places
    // Try different aggregation paths
    
    let aggregationPipeline: any[] = [];
    
    // Option 1: If offers are directly under product
    if (sampleProduct?.offers) {
      aggregationPipeline = [
        { $match: { offers: { $exists: true, $not: { $size: 0 } } } },
        { $unwind: '$offers' },
        {
          $project: {
            productId: 1,
            farmerId: 1,
            cropBriefDetails: 1,
            category: 1,
            subCategory: 1,
            grade: 1,
            
            // Offer fields
            offerId: '$offers.offerId',
            traderId: '$offers.traderId',
            traderName: '$offers.traderName',
            offeredPrice: '$offers.offeredPrice',
            quantity: '$offers.quantity',
            status: '$offers.status',
            counterPrice: '$offers.counterPrice',
            counterQuantity: '$offers.counterQuantity',
            counterDate: '$offers.counterDate',
            isCounterPrivate: '$offers.isCounterPrivate',
            createdAt: '$offers.createdAt'
          }
        }
      ];
    }
    // Option 2: If offers are inside gradePrices
    else if (sampleProduct?.gradePrices) {
      aggregationPipeline = [
        { $match: { 'gradePrices.offers': { $exists: true, $not: { $size: 0 } } } },
        { $unwind: '$gradePrices' },
        { $match: { 'gradePrices.offers': { $exists: true, $not: { $size: 0 } } } },
        { $unwind: '$gradePrices.offers' },
        {
          $project: {
            productId: 1,
            farmerId: 1,
            cropBriefDetails: 1,
            category: 1,
            subCategory: 1,
            grade: '$gradePrices.grade',
            
            // Offer fields
            offerId: '$gradePrices.offers.offerId',
            traderId: '$gradePrices.offers.traderId',
            traderName: '$gradePrices.offers.traderName',
            offeredPrice: '$gradePrices.offers.offeredPrice',
            quantity: '$gradePrices.offers.quantity',
            status: '$gradePrices.offers.status',
            counterPrice: '$gradePrices.offers.counterPrice',
            counterQuantity: '$gradePrices.offers.counterQuantity',
            counterDate: '$gradePrices.offers.counterDate',
            isCounterPrivate: '$gradePrices.offers.isCounterPrivate',
            createdAt: '$gradePrices.offers.createdAt'
          }
        }
      ];
    }
    // Option 3: Try to find offers anywhere in the document
    else {
      // Use $objectToArray and $filter to find offers dynamically
      aggregationPipeline = [
        {
          $addFields: {
            allOffers: {
              $filter: {
                input: { $objectToArray: "$$ROOT" },
                as: "field",
                cond: {
                  $or: [
                    { $eq: ["$$field.k", "offers"] },
                    { $eq: ["$$field.k", "bids"] },
                    { $regexMatch: { input: "$$field.k", regex: /offer/i } }
                  ]
                }
              }
            }
          }
        },
        { $match: { allOffers: { $ne: [] } } },
        { $unwind: '$allOffers' },
        { $unwind: '$allOffers.v' },
        {
          $project: {
            productId: 1,
            farmerId: 1,
            cropBriefDetails: 1,
            
            // Dynamic offer extraction
            offerData: '$allOffers.v'
          }
        }
      ];
    }
    
    // Apply filters if provided
    if (status) {
      aggregationPipeline.splice(1, 0, { 
        $match: { 
          $or: [
            { 'offers.status': status },
            { 'gradePrices.offers.status': status }
          ]
        } 
      });
    }
    
    if (traderId) {
      aggregationPipeline.splice(1, 0, { 
        $match: { 
          $or: [
            { 'offers.traderId': traderId },
            { 'gradePrices.offers.traderId': traderId }
          ]
        } 
      });
    }
    
    if (productId) {
      aggregationPipeline.splice(1, 0, { $match: { productId: productId } });
    }
    
    // Add sort and pagination
    aggregationPipeline.push({ $sort: { createdAt: -1 } });
    
    // Get total count
    const countPipeline = [...aggregationPipeline.slice(0, -1), { $count: 'total' }];
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    
    // Add pagination
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });
    
    // Execute query
    const offers = await Product.aggregate(aggregationPipeline);
    
    // Clean up the data for frontend
    const formattedOffers = offers.map(offer => {
      // If using dynamic extraction, format it
      if (offer.offerData) {
        return {
          productId: offer.productId,
          farmerId: offer.farmerId,
          cropBriefDetails: offer.cropBriefDetails,
          ...offer.offerData
        };
      }
      return offer;
    });
    
    return NextResponse.json({
      success: true,
      data: formattedOffers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      debug: {
        sampleStructure: sampleProduct ? Object.keys(sampleProduct) : 'No sample found',
        offersCount: formattedOffers.length
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching trader bids:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trader bids',
      error: error.message
    }, { status: 500 });
  }
}