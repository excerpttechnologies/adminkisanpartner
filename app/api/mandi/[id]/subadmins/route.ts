import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Mandi from "@/app/models/Mandi";
import Admin from "@/app/models/Admin";
import { getAdminSession } from "@/app/lib/auth";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

/* ─── GET  /api/mandi/[id]/subadmins ────────────────────
   Returns the list of subadmins currently assigned to mandi
──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const session = await getAdminSession();
    if (!session?.admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const mandi = await Mandi.findById(id)
      .populate("subAdmins", "-password")
      .lean();

    if (!mandi) {
      return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: (mandi as any).subAdmins || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch subadmins" },
      { status: 500 }
    );
  }
}

/* ─── POST  /api/mandi/[id]/subadmins ───────────────────
   Body: { subAdminId: string }  → assigns a subadmin to this mandi
   OR    { removeId: string }    → removes a subadmin from this mandi
──────────────────────────────────────────────────────── */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const session = await getAdminSession();
    if (!session?.admin || session.admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Only admin can assign subadmins." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { subAdminId, removeId } = body;

    const mandi = await Mandi.findById(id);
    if (!mandi) {
      return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
    }

    /* ── REMOVE subadmin ── */
    if (removeId) {
      if (!mongoose.Types.ObjectId.isValid(removeId)) {
        return NextResponse.json({ success: false, message: "Invalid subadmin ID" }, { status: 400 });
      }
      mandi.subAdmins = mandi.subAdmins.filter(
        (sid) => sid.toString() !== removeId
      );
      await mandi.save();

      const updated = await Mandi.findById(id)
        .populate("subAdmins", "-password")
        .lean();
      return NextResponse.json({
        success: true,
        message: "Subadmin removed from mandi",
        data: (updated as any).subAdmins,
      });
    }

    /* ── ASSIGN subadmin ── */
    if (!subAdminId) {
      return NextResponse.json({ success: false, message: "subAdminId is required" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(subAdminId)) {
      return NextResponse.json({ success: false, message: "Invalid subadmin ID" }, { status: 400 });
    }

    // Verify the subadmin exists and has role=subadmin
    const subAdmin = await Admin.findOne({
      _id: subAdminId,
      role: "subadmin",
      isDeleted: { $ne: true },
    });
    if (!subAdmin) {
      return NextResponse.json(
        { success: false, message: "Subadmin not found or is not a subadmin account" },
        { status: 404 }
      );
    }

    // Avoid duplicates
    const alreadyAssigned = mandi.subAdmins.some(
      (sid) => sid.toString() === subAdminId
    );
    if (alreadyAssigned) {
      return NextResponse.json(
        { success: false, message: "This subadmin is already assigned to this mandi" },
        { status: 409 }
      );
    }

    mandi.subAdmins.push(new mongoose.Types.ObjectId(subAdminId));
    await mandi.save();

    const updated = await Mandi.findById(id)
      .populate("subAdmins", "-password")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Subadmin assigned to mandi successfully",
      data: (updated as any).subAdmins,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update subadmins" },
      { status: 500 }
    );
  }
}