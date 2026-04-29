// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import ProductItem from '@/app/models/ProductItem';

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const search = searchParams.get('search') || '';
//     const category = searchParams.get('category') || '';
//     const status = searchParams.get('status') || '';
    
//     let query: any = {};
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (category) query.category = category;
//     if (status) query.status = status;
    
//     const skip = (page - 1) * limit;
    
//     const [products, total] = await Promise.all([
//       ProductItem.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
//       ProductItem.countDocuments(query)
//     ]);
    
//     return NextResponse.json({
//       success: true,
//       data: products,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error fetching products', error: String(error) },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const {
//       name,
//       price,
//       category,
//       stock,
//       description,
//       imageUrl,
//       minOrderQty,
//       unit,
//       status
//     } = body;
    
//     // Validation
//     if (!name || !price || !category || !description || !imageUrl) {
//       return NextResponse.json(
//         { success: false, message: 'Missing required fields: name, price, category, description, imageUrl' },
//         { status: 400 }
//       );
//     }
    
//     const product = await ProductItem.create({
//       name,
//       price,
//       category,
//       stock: stock || 0,
//       description,
//       imageUrl,
//       minOrderQty: minOrderQty || 1,
//       unit: unit || 'kg',
//       status: status || 'active'
//     });
    
//     return NextResponse.json({
//       success: true,
//       message: 'Product created successfully',
//       data: product
//     }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error creating product', error: String(error) },
//       { status: 500 }
//     );
//   }
// }











// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import ProductItem from '@/app/models/ProductItem';

// // GET - Fetch all products
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const search = searchParams.get('search') || '';
//     const category = searchParams.get('category') || '';
//     const status = searchParams.get('status') || '';
    
//     let query: any = {};
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (category) query.category = category;
//     if (status) query.status = status;
    
//     const skip = (page - 1) * limit;
    
//     const [products, total] = await Promise.all([
//       ProductItem.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
//       ProductItem.countDocuments(query)
//     ]);
    
//     return NextResponse.json({
//       success: true,
//       data: products,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error fetching products', error: String(error) },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create new product
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const {
//       name,
//       price,
//       category,
//       stock,
//       description,
//       imageUrl,
//       minOrderQty,
//       unit,
//       status
//     } = body;
    
//     // Validation
//     if (!name || !price || !category || !description || !imageUrl) {
//       return NextResponse.json(
//         { success: false, message: 'Missing required fields: name, price, category, description, imageUrl' },
//         { status: 400 }
//       );
//     }
    
//     const product = await ProductItem.create({
//       name,
//       price,
//       category,
//       stock: stock || 0,
//       description,
//       imageUrl,
//       minOrderQty: minOrderQty || 1,
//       unit: unit || 'kg',
//       status: status || 'active'
//     });
    
//     return NextResponse.json({
//       success: true,
//       message: 'Product created successfully',
//       data: product
//     }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error creating product', error: String(error) },
//       { status: 500 }
//     );
//   }
// }











// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import ProductItem from '@/app/models/ProductItem';

// // GET - Fetch all products
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const search = searchParams.get('search') || '';
//     const category = searchParams.get('category') || '';
//     const status = searchParams.get('status') || '';

//     let query: any = {};

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } },
//       ];
//     }

//     if (category) query.category = category;
//     if (status) query.status = status;

//     const skip = (page - 1) * limit;

//     const [products, total] = await Promise.all([
//       ProductItem.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
//       ProductItem.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       success: true,
//       data: products,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error fetching products', error: String(error) },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create new product
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();

//     const body = await request.json();
//     const {
//       name,
//       price,
//       category,
//       stock,
//       description,
//       images,
//       imageUrl,
//       minOrderQty,
//       unit,
//       status,
//     } = body;

//     // Support both new `images` array and legacy `imageUrl` string
//     let resolvedImages: string[] = [];

//     if (images && Array.isArray(images)) {
//       resolvedImages = images.filter((img: string) => img && img.trim() !== '');
//     }

//     if (resolvedImages.length === 0 && imageUrl) {
//       resolvedImages = [imageUrl];
//     }

//     // Validation
//     if (!name || !price || !category || !description || resolvedImages.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: 'Missing required fields: name, price, category, description, and at least one image',
//         },
//         { status: 400 }
//       );
//     }

//     const product = await ProductItem.create({
//       name,
//       price,
//       category,
//       stock: stock || 0,
//       description,
//       images: resolvedImages,
//       minOrderQty: minOrderQty || 1,
//       unit: unit || 'kg',
//       status: status || 'active',
//     });

//     return NextResponse.json(
//       { success: true, message: 'Product created successfully', data: product },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error creating product:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error creating product', error: String(error) },
//       { status: 500 }
//     );
//   }
// }












import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import ProductItem from '@/app/models/ProductItem';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const subCategory = searchParams.get('subCategory') || '';
    const status = searchParams.get('status') || '';

    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      ProductItem.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductItem.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching products', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, price, category, subCategory, stock, description, images, imageUrl, minOrderQty, unit, status } = body;

    let resolvedImages: string[] = [];
    if (images && Array.isArray(images)) {
      resolvedImages = images.filter((img: string) => img && img.trim() !== '');
    }
    if (resolvedImages.length === 0 && imageUrl) resolvedImages = [imageUrl];

    if (!name || !price || !category || !description || resolvedImages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, price, category, description, and at least one image' },
        { status: 400 }
      );
    }

    const product = await ProductItem.create({
      name,
      price,
      category,
      subCategory: subCategory || '',
      stock: stock || 0,
      description,
      images: resolvedImages,
      minOrderQty: minOrderQty || 1,
      unit: unit || 'kg',
      status: status || 'active',
    });

    return NextResponse.json(
      { success: true, message: 'Product created successfully', data: product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error creating product', error: String(error) },
      { status: 500 }
    );
  }
}