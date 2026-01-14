// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/Db';
// import Product from '@/app/models/Product';

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     // Get query parameters
//     const searchParams = request.nextUrl.searchParams;
//     const status = searchParams.get('status');
//     const traderId = searchParams.get('traderId');
//     const farmerId = searchParams.get('farmerId');
//     const productId = searchParams.get('productId');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');
//     const skip = (page - 1) * limit;
    
//     // Since we don't know the exact schema structure,
//     // we'll use a flexible aggregation approach
    
//     // First, let's see what the data looks like
//     const sampleProduct = await Product.findOne({
//       $or: [
//         { 'offers': { $exists: true } },
//         { 'gradePrices.offers': { $exists: true } },
//         { 'bids': { $exists: true } }
//       ]
//     }).lean();
    
//     console.log('Sample product structure:', Object.keys(sampleProduct || {}));
    
//     // Based on your team's schema, offers could be in different places
//     // Try different aggregation paths
    
//     let aggregationPipeline: any[] = [];
    
//     // Option 1: If offers are directly under product
//     if (sampleProduct?.offers) {
//       aggregationPipeline = [
//         { $match: { offers: { $exists: true, $not: { $size: 0 } } } },
//         { $unwind: '$offers' },
//         {
//           $project: {
//             productId: 1,
//             farmerId: 1,
//             cropBriefDetails: 1,
//             category: 1,
//             subCategory: 1,
//             grade: 1,
            
//             // Offer fields
//             offerId: '$offers.offerId',
//             traderId: '$offers.traderId',
//             traderName: '$offers.traderName',
//             offeredPrice: '$offers.offeredPrice',
//             quantity: '$offers.quantity',
//             status: '$offers.status',
//             counterPrice: '$offers.counterPrice',
//             counterQuantity: '$offers.counterQuantity',
//             counterDate: '$offers.counterDate',
//             isCounterPrivate: '$offers.isCounterPrivate',
//             createdAt: '$offers.createdAt'
//           }
//         }
//       ];
//     }
//     // Option 2: If offers are inside gradePrices
//     else if (sampleProduct?.gradePrices) {
//       aggregationPipeline = [
//         { $match: { 'gradePrices.offers': { $exists: true, $not: { $size: 0 } } } },
//         { $unwind: '$gradePrices' },
//         { $match: { 'gradePrices.offers': { $exists: true, $not: { $size: 0 } } } },
//         { $unwind: '$gradePrices.offers' },
//         {
//           $project: {
//             productId: 1,
//             farmerId: 1,
//             cropBriefDetails: 1,
//             category: 1,
//             subCategory: 1,
//             grade: '$gradePrices.grade',
            
//             // Offer fields
//             offerId: '$gradePrices.offers.offerId',
//             traderId: '$gradePrices.offers.traderId',
//             traderName: '$gradePrices.offers.traderName',
//             offeredPrice: '$gradePrices.offers.offeredPrice',
//             quantity: '$gradePrices.offers.quantity',
//             status: '$gradePrices.offers.status',
//             counterPrice: '$gradePrices.offers.counterPrice',
//             counterQuantity: '$gradePrices.offers.counterQuantity',
//             counterDate: '$gradePrices.offers.counterDate',
//             isCounterPrivate: '$gradePrices.offers.isCounterPrivate',
//             createdAt: '$gradePrices.offers.createdAt'
//           }
//         }
//       ];
//     }
//     // Option 3: Try to find offers anywhere in the document
//     else {
//       // Use $objectToArray and $filter to find offers dynamically
//       aggregationPipeline = [
//         {
//           $addFields: {
//             allOffers: {
//               $filter: {
//                 input: { $objectToArray: "$$ROOT" },
//                 as: "field",
//                 cond: {
//                   $or: [
//                     { $eq: ["$$field.k", "offers"] },
//                     { $eq: ["$$field.k", "bids"] },
//                     { $regexMatch: { input: "$$field.k", regex: /offer/i } }
//                   ]
//                 }
//               }
//             }
//           }
//         },
//         { $match: { allOffers: { $ne: [] } } },
//         { $unwind: '$allOffers' },
//         { $unwind: '$allOffers.v' },
//         {
//           $project: {
//             productId: 1,
//             farmerId: 1,
//             cropBriefDetails: 1,
            
//             // Dynamic offer extraction
//             offerData: '$allOffers.v'
//           }
//         }
//       ];
//     }
    
//     // Apply filters if provided
//     if (status) {
//       aggregationPipeline.splice(1, 0, { 
//         $match: { 
//           $or: [
//             { 'offers.status': status },
//             { 'gradePrices.offers.status': status }
//           ]
//         } 
//       });
//     }
    
//     if (traderId) {
//       aggregationPipeline.splice(1, 0, { 
//         $match: { 
//           $or: [
//             { 'offers.traderId': traderId },
//             { 'gradePrices.offers.traderId': traderId }
//           ]
//         } 
//       });
//     }
    
//     if (productId) {
//       aggregationPipeline.splice(1, 0, { $match: { productId: productId } });
//     }
    
//     // Add sort and pagination
//     aggregationPipeline.push({ $sort: { createdAt: -1 } });
    
//     // Get total count
//     const countPipeline = [...aggregationPipeline.slice(0, -1), { $count: 'total' }];
//     const countResult = await Product.aggregate(countPipeline);
//     const total = countResult[0]?.total || 0;
    
//     // Add pagination
//     aggregationPipeline.push({ $skip: skip });
//     aggregationPipeline.push({ $limit: limit });
    
//     // Execute query
//     const offers = await Product.aggregate(aggregationPipeline);
    
//     // Clean up the data for frontend
//     const formattedOffers = offers.map(offer => {
//       // If using dynamic extraction, format it
//       if (offer.offerData) {
//         return {
//           productId: offer.productId,
//           farmerId: offer.farmerId,
//           cropBriefDetails: offer.cropBriefDetails,
//           ...offer.offerData
//         };
//       }
//       return offer;
//     });
    
//     return NextResponse.json({
//       success: true,
//       data: formattedOffers,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       },
//       debug: {
//         sampleStructure: sampleProduct ? Object.keys(sampleProduct) : 'No sample found',
//         offersCount: formattedOffers.length
//       }
//     });
    
//   } catch (error: any) {
//     console.error('Error fetching trader bids:', error);
//     return NextResponse.json({
//       success: false,
//       message: 'Failed to fetch trader bids',
//       error: error.message
//     }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Product from '@/app/models/Product';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get all query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const traderId = searchParams.get('traderId') || '';
    const farmerId = searchParams.get('farmerId') || '';
    const productId = searchParams.get('productId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const skip = (page - 1) * limit;
    
    console.log('API Parameters:', {
      search, status, traderId, farmerId, productId, page, limit, sortBy, order
    });

    // Build match conditions
    const matchConditions: any = {
      $or: [
        { offers: { $exists: true, $not: { $size: 0 } } },
        { 'gradePrices.offers': { $exists: true, $not: { $size: 0 } } }
      ]
    };

    // Add status filter if specified
    if (status) {
      matchConditions.$and = [
        { $or: [
          { 'offers.status': status },
          { 'gradePrices.offers.status': status }
        ]}
      ];
    }

    // Add product ID filter if specified
    if (productId) {
      matchConditions.productId = { $regex: productId, $options: 'i' };
    }

    // Add farmer ID filter if specified
    if (farmerId) {
      matchConditions.farmerId = { $regex: farmerId, $options: 'i' };
    }

    // Build aggregation pipeline
    let pipeline: any[] = [
      // Stage 1: Match products with offers
      {
        $match: matchConditions
      },
      
      // Stage 2: Unwind gradePrices for offers inside gradePrices
      {
        $unwind: {
          path: '$gradePrices',
          preserveNullAndEmptyArrays: true
        }
      },
      
      // Stage 3: Add fields to separate offer sources
      {
        $addFields: {
          gradeOffers: {
            $cond: {
              if: {
                $and: [
                  { $isArray: '$gradePrices.offers' },
                  { $gt: [{ $size: { $ifNull: ['$gradePrices.offers', []] } }, 0] }
                ]
              },
              then: '$gradePrices.offers',
              else: []
            }
          },
          directOffers: {
            $cond: {
              if: {
                $and: [
                  { $isArray: '$offers' },
                  { $gt: [{ $size: { $ifNull: ['$offers', []] } }, 0] }
                ]
              },
              then: '$offers',
              else: []
            }
          }
        }
      },
      
      // Stage 4: Combine all offers
      {
        $project: {
          productId: 1,
          farmerId: 1,
          cropBriefDetails: 1,
          category: 1,
          subCategory: 1,
          grade: { $ifNull: ['$gradePrices.grade', 'N/A'] },
          nearestMarket: 1,
          allOffers: {
            $concatArrays: ['$gradeOffers', '$directOffers']
          }
        }
      },
      
      // Stage 5: Unwind offers
      {
        $unwind: '$allOffers'
      },
      
      // Stage 6: Filter out empty offers
      {
        $match: {
          'allOffers': { $ne: null }
        }
      },
      
      // Stage 7: Project final structure
      {
        $project: {
          productId: 1,
          farmerId: 1,
          cropBriefDetails: 1,
          grade: 1,
          nearestMarket: 1,
          offerId: { 
            $ifNull: [
              '$allOffers.offerId',
              { $toString: new Types.ObjectId() }
            ]
          },
          traderId: { $ifNull: ['$allOffers.traderId', 'Unknown'] },
          traderName: { $ifNull: ['$allOffers.traderName', 'Unknown Trader'] },
          offeredPrice: { $ifNull: ['$allOffers.offeredPrice', 0] },
          quantity: { $ifNull: ['$allOffers.quantity', 0] },
          status: { 
            $ifNull: [
              '$allOffers.status',
              'pending'
            ]
          },
          counterPrice: '$allOffers.counterPrice',
          counterQuantity: '$allOffers.counterQuantity',
          counterDate: '$allOffers.counterDate',
          isCounterPrivate: { $ifNull: ['$allOffers.isCounterPrivate', false] },
          createdAt: {
            $ifNull: [
              '$allOffers.createdAt',
              '$allOffers.createdDate',
              '$allOffers.date',
              new Date()
            ]
          }
        }
      }
    ];

    // Apply search filter AFTER extracting offers
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { traderName: { $regex: search, $options: 'i' } },
            { traderId: { $regex: search, $options: 'i' } },
            { productId: { $regex: search, $options: 'i' } },
            { offerId: { $regex: search, $options: 'i' } },
            { cropBriefDetails: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Apply traderId filter AFTER extracting offers
    if (traderId && !search) {
      pipeline.push({
        $match: {
          traderId: { $regex: traderId, $options: 'i' }
        }
      });
    }

    // Add totalValue field for calculations
    pipeline.push({
      $addFields: {
        totalValue: {
          $multiply: ['$offeredPrice', '$quantity']
        }
      }
    });

    // Create count pipeline for pagination
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: 'total' });

    // Execute count query
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    pipeline.push({
      $sort: { [sortBy]: sortOrder }
    });

    // Add pagination
    if (limit < 10000) { // Only paginate for normal requests, not export
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });
    }

    console.log('Aggregation Pipeline:', JSON.stringify(pipeline, null, 2));

    // Execute main query
    const offers = await Product.aggregate(pipeline);

    console.log(`Found ${offers.length} offers`);

    // Calculate summary statistics
    const totalValue = offers.reduce((sum, offer) => {
      return sum + (offer.offeredPrice * offer.quantity);
    }, 0);

    const statusCounts = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      countered: 0
    };

    offers.forEach(offer => {
      const status = offer.status?.toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status as keyof typeof statusCounts]++;
      }
    });

    // Add _id to each offer if missing
    const formattedOffers = offers.map(offer => ({
      ...offer,
      _id: offer._id || new Types.ObjectId().toString(),
      totalValue: offer.offeredPrice * offer.quantity
    }));

    // Get unique traders and products for filter dropdowns
    const uniqueTraders = Array.from(
      new Set(
        offers
          .filter(offer => offer.traderId && offer.traderName)
          .map(offer => `${offer.traderId}|${offer.traderName}`)
      )
    ).map(str => {
      const [id, name] = str.split('|');
      return { id, name };
    });

    const uniqueProducts = Array.from(
      new Set(offers.filter(offer => offer.productId).map(offer => offer.productId))
    );

    // Prepare response
    const response = {
      success: true,
      data: formattedOffers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalOffers: total,
        totalValue,
        statusCounts
      },
      filters: {
        uniqueTraders,
        uniqueProducts
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error in trader-bids-reports API:', error);
    
    // Return empty data structure matching frontend expectations
    return NextResponse.json({
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      },
      summary: {
        totalOffers: 0,
        totalValue: 0,
        statusCounts: {
          pending: 0,
          accepted: 0,
          rejected: 0,
          countered: 0
        }
      },
      filters: {
        uniqueTraders: [],
        uniqueProducts: []
      },
      error: error.message,
      message: 'Failed to fetch trader bids'
    }, { status: 500 });
  }
}

// POST endpoint for creating test data (optional)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { action } = body;
    
    if (action === 'createSampleData') {
      // Create sample product with offers
      const sampleOffers = [
        {
          offerId: `OFFER-${Date.now()}-1`,
          traderId: 'TRADER001',
          traderName: 'John Traders',
          offeredPrice: 2500,
          quantity: 100,
          status: 'pending',
          counterPrice: 2600,
          counterQuantity: 90,
          counterDate: new Date().toISOString(),
          isCounterPrivate: false,
          createdAt: new Date().toISOString()
        },
        {
          offerId: `OFFER-${Date.now()}-2`,
          traderId: 'TRADER002',
          traderName: 'Smith Agro',
          offeredPrice: 2700,
          quantity: 150,
          status: 'accepted',
          counterPrice: null,
          counterQuantity: null,
          counterDate: null,
          isCounterPrivate: false,
          createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
          offerId: `OFFER-${Date.now()}-3`,
          traderId: 'TRADER003',
          traderName: 'Green Fields',
          offeredPrice: 2300,
          quantity: 80,
          status: 'countered',
          counterPrice: 2400,
          counterQuantity: 75,
          counterDate: new Date().toISOString(),
          isCounterPrivate: true,
          createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ];
      
      const sampleProduct = await Product.findOneAndUpdate(
        { productId: 'PROD001' },
        {
          $setOnInsert: {
            productId: 'PROD001',
            farmerId: 'FARMER001',
            cropBriefDetails: 'Premium Wheat - Organic',
            category: 'Cereals',
            subCategory: 'Wheat',
            grade: 'A',
            nearestMarket: 'Delhi Mandi'
          },
          $set: {
            offers: sampleOffers
          }
        },
        { upsert: true, new: true }
      );
      
      // Create another product with offers in gradePrices
      const sampleProduct2 = await Product.findOneAndUpdate(
        { productId: 'PROD002' },
        {
          $setOnInsert: {
            productId: 'PROD002',
            farmerId: 'FARMER002',
            cropBriefDetails: 'Basmati Rice',
            category: 'Cereals',
            subCategory: 'Rice',
            nearestMarket: 'Punjab Mandi'
          },
          $set: {
            gradePrices: [{
              grade: 'Premium',
              offers: [
                {
                  offerId: `OFFER-${Date.now()}-4`,
                  traderId: 'TRADER004',
                  traderName: 'Rice Exporters Ltd',
                  offeredPrice: 3200,
                  quantity: 200,
                  status: 'accepted',
                  createdAt: new Date().toISOString()
                }
              ]
            }]
          }
        },
        { upsert: true, new: true }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Sample data created successfully',
        data: {
          product1: sampleProduct,
          product2: sampleProduct2
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error in POST endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create sample data',
      error: error.message
    }, { status: 500 });
  }
}