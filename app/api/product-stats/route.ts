// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import ProductItem from '@/app/models/ProductItem';

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const [totalProducts, activeProducts, lowStock, categoryStats] = await Promise.all([
//       ProductItem.countDocuments(),
//       ProductItem.countDocuments({ status: 'active' }),
//       ProductItem.countDocuments({ stock: { $lt: 50 } }),
//       ProductItem.aggregate([
//         { $group: { _id: '$category', count: { $sum: 1 } } }
//       ])
//     ]);
    
//     return NextResponse.json({
//       success: true,
//       data: {
//         totalProducts,
//         activeProducts,
//         lowStock,
//         categoryStats
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching stats:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error fetching statistics', error: String(error) },
//       { status: 500 }
//     );
//   }
// }













import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import ProductItem from '@/app/models/ProductItem';

export async function GET() {
  try {
    await connectDB();
    const [totalProducts, activeProducts, lowStock] = await Promise.all([
      ProductItem.countDocuments(),
      ProductItem.countDocuments({ status: 'active' }),
      ProductItem.countDocuments({ stock: { $lt: 50 } }),
    ]);
    return NextResponse.json({ success: true, data: { totalProducts, activeProducts, lowStock } });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching stats', error: String(error) },
      { status: 500 }
    );
  }
}