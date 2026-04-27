// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Mandi from "@/app/models/Mandi";
// import { getAdminSession } from "@/app/lib/auth";

// type Params = { params: Promise<{ id: string }> };

// /* ─── GET  /api/mandi/[id] ──────────────────────────── */
// export async function GET(req: NextRequest, { params }: Params) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();
//     if (!session?.admin) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await params;
//     const mandi = await Mandi.findById(id)
//       .populate("subAdmins", "name email role state district taluka pageAccess isDeleted")
//       .lean();

//     if (!mandi) {
//       return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
//     }

//     // Subadmins can only view their own mandi
//     if (
//       session.admin.role === "subadmin" &&
//       !(mandi as any).subAdmins?.some((sa: any) => sa._id?.toString() === session.admin._id)
//     ) {
//       return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
//     }

//     return NextResponse.json({ success: true, data: mandi });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to fetch mandi" },
//       { status: 500 }
//     );
//   }
// }

// /* ─── PUT  /api/mandi/[id] ──────────────────────────── */
// export async function PUT(req: NextRequest, { params }: Params) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();
//     if (!session?.admin || session.admin.role !== "admin") {
//       return NextResponse.json({ success: false, message: "Unauthorized. Only admin can update mandis." }, { status: 403 });
//     }

//     const { id } = await params;
//     const body = await req.json();

//     // Whitelist updatable fields
//     const { mandiName, state, district, taluka, address, pincode, isActive, allowPostingView } = body;

//     const updateData: any = {};
//     if (mandiName   !== undefined) updateData.mandiName        = mandiName.trim();
//     if (state       !== undefined) updateData.state             = state.trim();
//     if (district    !== undefined) updateData.district          = district.trim();
//     if (taluka      !== undefined) updateData.taluka            = taluka.trim();
//     if (address     !== undefined) updateData.address           = address.trim();
//     if (pincode     !== undefined) updateData.pincode           = pincode.trim();
//     if (isActive    !== undefined) updateData.isActive          = isActive;
//     if (allowPostingView !== undefined) updateData.allowPostingView = allowPostingView;

//     const updated = await Mandi.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
//       .populate("subAdmins", "name email role");

//     if (!updated) {
//       return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, message: "Mandi updated successfully", data: updated });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to update mandi" },
//       { status: 500 }
//     );
//   }
// }

// /* ─── DELETE  /api/mandi/[id] ───────────────────────── */
// export async function DELETE(req: NextRequest, { params }: Params) {
//   try {
//     await connectDB();
//     const session = await getAdminSession();
//     if (!session?.admin || session.admin.role !== "admin") {
//       return NextResponse.json({ success: false, message: "Unauthorized. Only admin can delete mandis." }, { status: 403 });
//     }

//     const { id } = await params;
//     const deleted = await Mandi.findByIdAndDelete(id);

//     if (!deleted) {
//       return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, message: "Mandi deleted successfully" });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to delete mandi" },
//       { status: 500 }
//     );
//   }
// }































import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Mandi from "@/app/models/Mandi";
import { getAdminSession } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string }> };

/* ─── GET  /api/mandi/[id] ──────────────────────────── */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const session = await getAdminSession();
    if (!session?.admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const mandi = await Mandi.findById(id)
      .populate("subAdmins", "name email role state district taluka pageAccess isDeleted")
      .lean();

    if (!mandi) {
      return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
    }

    // Subadmins can only view their own mandi
    if (session.admin.role === "subadmin") {
      const subAdminIds: string[] = ((mandi as any).subAdmins || []).map(
        (sa: any) => (sa._id ?? sa).toString()
      );
      if (!subAdminIds.includes(session.admin._id.toString())) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, data: mandi });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch mandi" },
      { status: 500 }
    );
  }
}

/* ─── PUT  /api/mandi/[id] ──────────────────────────── */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const session = await getAdminSession();
    if (!session?.admin || session.admin.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized. Only admin can update mandis." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    // Whitelist updatable fields
    const { mandiName, state, district, taluka, address, pincode, isActive, allowPostingView, allowMobileView } = body;

    const updateData: any = {};
    if (mandiName        !== undefined) updateData.mandiName        = mandiName.trim();
    if (state            !== undefined) updateData.state             = state.trim();
    if (district         !== undefined) updateData.district          = district.trim();
    if (taluka           !== undefined) updateData.taluka            = taluka.trim();
    if (address          !== undefined) updateData.address           = address.trim();
    if (pincode          !== undefined) updateData.pincode           = pincode.trim();
    if (isActive         !== undefined) updateData.isActive          = isActive;
    if (allowPostingView !== undefined) updateData.allowPostingView  = allowPostingView;
    if (allowMobileView  !== undefined) updateData.allowMobileView   = allowMobileView;

    const updated = await Mandi.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("subAdmins", "name email role");

    if (!updated) {
      return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Mandi updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update mandi" },
      { status: 500 }
    );
  }
}

/* ─── DELETE  /api/mandi/[id] ───────────────────────── */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const session = await getAdminSession();
    if (!session?.admin || session.admin.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized. Only admin can delete mandis." }, { status: 403 });
    }

    const { id } = await params;
    const deleted = await Mandi.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Mandi deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete mandi" },
      { status: 500 }
    );
  }
}