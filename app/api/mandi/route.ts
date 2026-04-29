










// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Mandi from "@/app/models/Mandi";
// import { getAdminSession } from "@/app/lib/auth";

// /* ─── helpers ─────────────────────────────────────────── */
// function generateMandiId(): string {
//   const ts = Date.now().toString(36).toUpperCase();
//   const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
//   return `MND-${ts}-${rand}`;
// }

// /* ─── GET  /api/mandi  ────────────────────────────────── */
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();
//     if (!session?.admin) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const search    = searchParams.get("search") || "";
//     const page      = Math.max(1, Number(searchParams.get("page"))  || 1);
//     const limit     = Math.min(100, Number(searchParams.get("limit")) || 0);
//     const state     = searchParams.get("state") || "";
//     const district  = searchParams.get("district") || "";
//     const isActive  = searchParams.get("isActive");

//     const filter: any = {};

//     if (search) {
//       filter.$or = [
//         { mandiName: { $regex: search, $options: "i" } },
//         { district:  { $regex: search, $options: "i" } },
//         { state:     { $regex: search, $options: "i" } },
//         { mandiId:   { $regex: search, $options: "i" } },
//       ];
//     }
//     if (state)    filter.state    = { $regex: state,    $options: "i" };
//     if (district) filter.district = { $regex: district, $options: "i" };
//     if (isActive !== null && isActive !== "") {
//       filter.isActive = isActive === "true";
//     }

//     // Subadmins can only see mandis they belong to
//     if (session.admin.role === "subadmin") {
//       filter.subAdmins = session.admin._id;
//     }

//     const total = await Mandi.countDocuments(filter);
//     const data  = await Mandi.find(filter)
//       .populate("subAdmins", "name email role state district taluka")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean();

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data,
//     });
//   } catch (error: any) {
//     console.error("GET /api/mandi error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to fetch mandis" },
//       { status: 500 }
//     );
//   }
// }

// /* ─── POST  /api/mandi  ──────────────────────────────── */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();

//     // Only admin (not subadmin) can create a mandi
//     if (!session?.admin || session.admin.role !== "admin") {
//       return NextResponse.json({ success: false, message: "Unauthorized. Only admin can create mandis." }, { status: 403 });
//     }

//     const body = await req.json();
//     const { mandiName, state, district, taluka, address, pincode, allowPostingView, allowMobileView } = body;

//     // Validation
//     if (!mandiName?.trim()) {
//       return NextResponse.json({ success: false, message: "Mandi name is required" }, { status: 400 });
//     }
//     if (!state?.trim()) {
//       return NextResponse.json({ success: false, message: "State is required" }, { status: 400 });
//     }
//     if (!district?.trim()) {
//       return NextResponse.json({ success: false, message: "District is required" }, { status: 400 });
//     }

//     // Duplicate name check within same district
//     const existing = await Mandi.findOne({
//       mandiName: { $regex: `^${mandiName.trim()}$`, $options: "i" },
//       district:  { $regex: `^${district.trim()}$`,  $options: "i" },
//     });
//     if (existing) {
//       return NextResponse.json(
//         { success: false, message: "A mandi with this name already exists in the same district" },
//         { status: 409 }
//       );
//     }

//     const mandi = await Mandi.create({
//       mandiId:          generateMandiId(),
//       mandiName:        mandiName.trim(),
//       state:            state.trim(),
//       district:         district.trim(),
//       taluka:           taluka?.trim()  || "",
//       address:          address?.trim() || "",
//       pincode:          pincode?.trim() || "",
//       allowPostingView: allowPostingView === true,
//       allowMobileView:  allowMobileView  === true,
//       createdBy:        session.admin._id,
//       subAdmins:        [],
//     });

//     return NextResponse.json(
//       { success: true, message: "Mandi created successfully", data: mandi },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("POST /api/mandi error:", error);
//     if (error.code === 11000) {
//       return NextResponse.json({ success: false, message: "Mandi ID conflict, please retry" }, { status: 409 });
//     }
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to create mandi" },
//       { status: 500 }
//     );
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Mandi from "@/app/models/Mandi";
import "@/app/models/Admin"; // ✅ ADD THIS LINE

import { getAdminSession } from "@/app/lib/auth";

/* ─── helpers ─────────────────────────────────────────── */
function generateMandiId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MND-${ts}-${rand}`;
}

/* ─── GET  /api/mandi  (PUBLIC) ───────────────────────── */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // ❌ Removed admin session check → now public

    const { searchParams } = new URL(req.url);
    const search    = searchParams.get("search") || "";
    const page      = Math.max(1, Number(searchParams.get("page"))  || 1);
    const limit     = Math.min(100, Number(searchParams.get("limit")) || 0);
    const state     = searchParams.get("state") || "";
    const district  = searchParams.get("district") || "";
    const isActive  = searchParams.get("isActive");

    const filter: any = {};

    if (search) {
      filter.$or = [
        { mandiName: { $regex: search, $options: "i" } },
        { district:  { $regex: search, $options: "i" } },
        { state:     { $regex: search, $options: "i" } },
        { mandiId:   { $regex: search, $options: "i" } },
      ];
    }
    if (state)    filter.state    = { $regex: state,    $options: "i" };
    if (district) filter.district = { $regex: district, $options: "i" };
    if (isActive !== null && isActive !== "") {
      filter.isActive = isActive === "true";
    }

    const total = await Mandi.countDocuments(filter);
    const data  = await Mandi.find(filter)
      .populate("subAdmins", "name email role state district taluka")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error: any) {
    console.error("GET /api/mandi error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch mandis" },
      { status: 500 }
    );
  }
}

/* ─── POST  /api/mandi  (PROTECTED) ───────────────────── */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getAdminSession();

    // ✅ Only admin can create
    if (!session?.admin || session.admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Only admin can create mandis." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      mandiName,
      state,
      district,
      taluka,
      address,
      pincode,
      allowPostingView,
      allowMobileView,
    } = body;

    // Validation
    if (!mandiName?.trim()) {
      return NextResponse.json({ success: false, message: "Mandi name is required" }, { status: 400 });
    }
    if (!state?.trim()) {
      return NextResponse.json({ success: false, message: "State is required" }, { status: 400 });
    }
    if (!district?.trim()) {
      return NextResponse.json({ success: false, message: "District is required" }, { status: 400 });
    }

    // Duplicate check
    const existing = await Mandi.findOne({
      mandiName: { $regex: `^${mandiName.trim()}$`, $options: "i" },
      district:  { $regex: `^${district.trim()}$`,  $options: "i" },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A mandi with this name already exists in the same district" },
        { status: 409 }
      );
    }

    const mandi = await Mandi.create({
      mandiId:          generateMandiId(),
      mandiName:        mandiName.trim(),
      state:            state.trim(),
      district:         district.trim(),
      taluka:           taluka?.trim()  || "",
      address:          address?.trim() || "",
      pincode:          pincode?.trim() || "",
      allowPostingView: allowPostingView === true,
      allowMobileView:  allowMobileView  === true,
      createdBy:        session.admin._id,
      subAdmins:        [],
    });

    return NextResponse.json(
      { success: true, message: "Mandi created successfully", data: mandi },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/mandi error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Mandi ID conflict, please retry" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Failed to create mandi" },
      { status: 500 }
    );
  }
}















