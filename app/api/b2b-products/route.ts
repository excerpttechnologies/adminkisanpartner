// app/api/b2b-products/route.ts (POST method)
import connectDB from "@/app/lib/Db";
import B2BProduct from "@/app/models/B2BProduct.model";
import B2BUser from "@/app/models/b2bUsers";
import { NextRequest, NextResponse } from "next/server";




export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log("Received product data:", body);

    
    
    // Validate required fields
    const requiredFields = [
      'productName', 'description', 'categoryId', 'categoryName',
      'subCategoryId', 'subCategoryName', 'images', 'price', 'quantity',
      'unit', 'taluk', 'postedBy', 'postedByName', 'role', 'userTaluk'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate images
    if (!body.images || body.images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }
    
    // Role-based validation
    const { role, taluk, userTaluk, verificationStatus, isActive } = body;
    
    if (role === 'subadmin') {
      if (userTaluk !== taluk) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Subadmin can only post products in your assigned taluk: ${userTaluk}` 
          },
          { status: 403 }
        );
      }
    } else if (role !== 'admin') {
      return NextResponse.json(
        { success: false, message: "Invalid role. Only admin or subadmin can post products" },
        { status: 403 }
      );
    }
    
    if (verificationStatus !== 'verified') {
      return NextResponse.json(
        { success: false, message: "Your account must be verified to post products" },
        { status: 403 }
      );
    }
    
    if (isActive === false) {
      return NextResponse.json(
        { success: false, message: "Your account is inactive" },
        { status: 403 }
      );
    }
    
    // Create product - ONLY fields that exist in schema
    const productData = {
      productName: body.productName,
      description: body.description,
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      subCategoryId: body.subCategoryId,
      subCategoryName: body.subCategoryName,
      images: body.images,
      price: body.price,
      quantity: body.quantity,
      unit: body.unit,
      taluk: body.taluk,
      postedBy: body.postedBy,
      postedByName: body.postedByName,
      status: 'active',
      isActive: true,
      verificationStatus: "pending",
    };
    
    console.log("Creating product with data:", productData);
    
    const product = new B2BProduct(productData);
    await product.save();
    
    return NextResponse.json({
      success: true,
      message: "Product created successfully. Waiting for admin verification.",
      product,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// app/api/b2b-products/route.ts (GET method)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const subCategoryId = searchParams.get("subCategoryId") || "";
    const taluk = searchParams.get("taluk") || "";
    const verificationStatus = searchParams.get("verificationStatus") || "";
    const postedBy = searchParams.get("postedBy") || "";
    const role = searchParams.get("role") || "";
    const adminTaluk = searchParams.get("adminTaluk") || "";
    
    const query: any = {};
    
    // Role-based filtering
    if (role === 'subadmin' && adminTaluk) {
      // Subadmin can only see products from their taluk
      query.taluk = adminTaluk;
    }
    // Admin can see all products - no taluk filter
    
    if (search) {
      query.$text = { $search: search };
    }
    if (categoryId) query.categoryId = categoryId;
    if (subCategoryId) query.subCategoryId = subCategoryId;
    if (taluk) query.taluk = taluk;
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (postedBy) query.postedBy = postedBy;
    
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      B2BProduct.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      B2BProduct.countDocuments(query),
    ]);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}