

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Farmer from "@/app/models/Farmer";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/app/lib/auth";
import { createAuditLog } from "@/app/_utils/auditLogger";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getAdminSession();

    const body = await req.json();

    // console.log("Received body:", body); // Debug log
if (!session) {
  return NextResponse.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
}

    /* ================= MOBILE VALIDATION ================= */
    const mobileNo = body.personalInfo?.mobileNo;

    if (!mobileNo) {
      return NextResponse.json(
        { success: false, message: "Mobile number is required" },
        { status: 400 }
      );
    }
    

    if (!/^\d{10}$/.test(mobileNo)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number must be exactly 10 digits",
        },
        { status: 400 }
      );
    }

    const role = body.role || "farmer";

    /* ================= DUPLICATE MOBILE CHECK ================= */
    const existingUser = await Farmer.findOne({
      "personalInfo.mobileNo": mobileNo,
      role,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number already exists",
        },
        { status: 409 }
      );
    }

    /* ================= MPIN VALIDATION (FIXED) ================= */
    const rawMpin = body.security?.mpin;
    let mpin: string | undefined;

    if (rawMpin !== undefined) {
      if (typeof rawMpin === "number") {
        mpin = rawMpin.toString();
      } else if (typeof rawMpin === "string") {
        mpin = rawMpin.trim();
      } else {
        return NextResponse.json(
          { success: false, message: "MPIN must be a 4-digit number" },
          { status: 400 }
        );
      }

      if (!/^\d{4}$/.test(mpin)) {
        return NextResponse.json(
          {
            success: false,
            message: "MPIN must be exactly 4 digits Number",
          },
          { status: 400 }
        );
      }
    }

    /* ================= PASSWORD VALIDATION ================= */
    if (body.security?.password && body.security.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    /* ================= HASHING ================= */
    const hashedPassword = body.security?.password
      ? await bcrypt.hash(body.security.password, 10)
      : "";

    const hashedMpin = mpin
      ? await bcrypt.hash(mpin, 10)
      : "";

    /* ================= GENERATE FARMER/TRADER ID ================= */
    // Generate unique ID based on role
    const generateUniqueId = async (role: string) => {
      let prefix = role === "farmer" ? "far-" : "trd-";
      let lastRecord;
      
      if (role === "farmer") {
        // Find the last farmer with farmerId
        lastRecord = await Farmer.findOne({
          role: "farmer",
          farmerId: { $regex: /^far-\d+$/ }
        }).sort({ farmerId: -1 });
      } else if (role === "trader") {
        // Find the last trader with traderId
        lastRecord = await Farmer.findOne({
          role: "trader",
          traderId: { $regex: /^trd-\d+$/ }
        }).sort({ traderId: -1 });
      }
      
      let nextNumber = 1;
      
      if (lastRecord) {
        const lastId = role === "farmer" ? lastRecord.farmerId : lastRecord.traderId;
        if (lastId) {
          const lastNumber = parseInt(lastId.split('-')[1]);
          if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
          }
        }
      }
      
      // Ensure the number is at least 2 digits
      const paddedNumber = nextNumber.toString().padStart(2, '0');
      return `${prefix}${paddedNumber}`;
    };

    const generatedId = await generateUniqueId(role);

    /* ================= CREATE FARMER DATA ================= */
    const farmerData: any = {
      personalInfo: {
        name: body.personalInfo?.name || "",
        mobileNo,
        email: body.personalInfo?.email || "",
        address: body.personalInfo?.address || "",
        villageGramaPanchayat: body.personalInfo?.villageGramaPanchayat || "",
        post: body.personalInfo?.post || "",
        pincode: body.personalInfo?.pincode || "",
        taluk: body.personalInfo?.taluk || "",
        district: body.personalInfo?.district || "",
        state: body.personalInfo?.state || "",
      },

      // FIXED: Add subcategories here
      commodities: body.commodities || [],
      subcategories: body.subcategories || [], // This line was missing
      nearestMarkets: body.nearestMarkets || [],

      // FIXED: Also include farmLand if it exists
      farmLand: body.farmLand || {},

      bankDetails: {
        accountHolderName: body.bankDetails?.accountHolderName || "",
        accountNumber: body.bankDetails?.accountNumber || "",
        ifscCode: body.bankDetails?.ifscCode || "",
        branch: body.bankDetails?.branch || "",
      },

      // FIXED: Include documents if they exist
      documents: body.documents || {},

      security: {
        referralCode: body.security?.referralCode || "",
        mpin: hashedMpin,
        password: hashedPassword,
      },

      role,
      isActive: body.isActive ?? true,
      registrationStatus: body.registrationStatus || "pending",
      registeredAt: new Date(),

      ...(role === "farmer" && {
        farmLocation: body.farmLocation || {},
      }),
    };

    // Add the generated ID based on role
    if (role === "farmer") {
      farmerData.farmerId = generatedId;
    } else if (role === "trader") {
      farmerData.traderId = generatedId;
    }

    // Debug log to check what data is being saved
    console.log("Farmer data to save:", {
      idField: role === "farmer" ? "farmerId" : "traderId",
      generatedId,
      commodities: farmerData.commodities,
      subcategories: farmerData.subcategories,
      commoditiesCount: farmerData.commodities.length,
      subcategoriesCount: farmerData.subcategories.length,
      hasPassword: !!body.security?.password,
      hasMpin: !!mpin,
    });

    /* ================= SAVE ================= */
    const farmer:any = await Farmer.create(farmerData);
    try {

      const data:{
        role:string;
        farmerId:string;
        traderId:string;
      }=farmer;

    
await createAuditLog({
  request: req,
  actorId: session.admin._id,
  actorRole: session.admin.role, // ADMIN or SUBADMIN
  action: "CREATE_FARMER",
  module: "Farmers",
  targetId: farmer._id,
  description: `${data.role=="farmer"?"Farmer":"Trader"} ${data?.role=="farmer"?data.farmerId : data.traderId} created by ${session.admin.name}`,
});
} catch(err) {
  // ❌ NEVER block main flow because of audit log
    console.error("AUDIT LOG FAILED:", err);
}
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data: farmer,
      generatedId: generatedId,
    });
  } catch (error: any) {
    console.error("Error in farmer registration:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Internal server error",
        errorDetails: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const district = searchParams.get("district") || "";
    const state = searchParams.get("state") || "";
    const taluk = searchParams.get("taluk") || "";
    const role = searchParams.get("role");
    const registrationStatus = searchParams.get("registrationStatus") || ""; // Add registrationStatus parameter
 
    // Start with an empty filter object
    const filter: any = {};

    // Build the $or conditions array
    const orConditions = [];
   
    if (search) {
      orConditions.push(
        { "personalInfo.name": { $regex: search, $options: "i" } },
        { "personalInfo.mobileNo": { $regex: search, $options: "i" } },
        { "personalInfo.email": { $regex: search, $options: "i" } },
        { "personalInfo.district": { $regex: search, $options: "i" } },
        { "personalInfo.state": { $regex: search, $options: "i" } },
        { "personalInfo.villageGramaPanchayat": { $regex: search, $options: "i" } },
        { "personalInfo.taluk": { $regex: search, $options: "i" } },
        { "personalInfo.pincode": { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
        { traderId: { $regex: search, $options: "i" } }
      );
    }

    ///farmerId
    if (district) {
      filter["personalInfo.district"] = { $regex: district, $options: "i" };
    }
    if (state) {
      filter["personalInfo.state"] = { $regex: state, $options: "i" };
    }

     if (taluk) {
      filter["personalInfo.taluk"] = taluk;
    }

    // Add registrationStatus filter if provided
    if (registrationStatus) {
      filter.registrationStatus = registrationStatus;
    }

    // Only add $or to filter if we have any conditions
    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    // Add role filter only if role is provided
    if (role) {
      filter.role = role;
    }

    // Set default registrationStatus for existing records
    // await Farmer.updateMany(
    //   { registrationStatus: { $exists: false } },
    //   { $set: { registrationStatus: "pending" } } // Changed to "pending" as default
    // );

    const total = await Farmer.countDocuments(filter);
    const data = await Farmer.find(filter)
      .sort({ registeredAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

      const data1=await Farmer.find({role})

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data,
      data1
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

