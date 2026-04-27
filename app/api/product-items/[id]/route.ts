// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import ProductItem from '@/app/models/ProductItem';

// // GET - Fetch single product by ID
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     await connectDB();
    
//     const product = await ProductItem.findById(id);
    
//     if (!product) {
//       return NextResponse.json(
//         { success: false, message: 'Product not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error fetching product', error: String(error) },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update product by ID
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     await connectDB();
    
//     const body = await request.json();
    
//     const product = await ProductItem.findByIdAndUpdate(
//       id,
//       body,
//       { new: true, runValidators: true }
//     );
    
//     if (!product) {
//       return NextResponse.json(
//         { success: false, message: 'Product not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: 'Product updated successfully',
//       data: product
//     });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error updating product', error: String(error) },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete product by ID
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     await connectDB();
    
//     const product = await ProductItem.findByIdAndDelete(id);
    
//     if (!product) {
//       return NextResponse.json(
//         { success: false, message: 'Product not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: 'Product deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error deleting product', error: String(error) },
//       { status: 500 }
//     );
//   }
// }














import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import ProductItem from '@/app/models/ProductItem';

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const product = await ProductItem.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching product', error: String(error) },
      { status: 500 }
    );
  }
}

// PUT - Update product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const body = await request.json();

    // Support both new `images` array and legacy `imageUrl` string
    if (body.images && Array.isArray(body.images)) {
      body.images = body.images.filter((img: string) => img && img.trim() !== '');
    }

    if ((!body.images || body.images.length === 0) && body.imageUrl) {
      body.images = [body.imageUrl];
    }

    // Clean up legacy field
    delete body.imageUrl;

    const product = await ProductItem.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating product', error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const product = await ProductItem.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting product', error: String(error) },
      { status: 500 }
    );
  }
}