import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Mandi from "@/app/models/Mandi";
import Posting from "@/app/models/Posting";
import Farmer from "@/app/models/Farmer";
import { getAdminSession } from "@/app/lib/auth";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

/* ─── GET  /api/mandi/[id]/postings ─────────────────────
   Returns crop postings by farmers in the mandi's district.

   Permission rules:
   - Admin        → always allowed
   - Subadmin     → only if:
       1. they belong to this mandi  (mandi.subAdmins contains their _id)
       2. mandi.allowPostingView === true

   Response NEVER includes total posting count for subadmins
   (only individual posting rows, no summary count field).
──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const session = await getAdminSession();
    if (!session?.admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    /* ── Fetch mandi ── */
    const mandi = await Mandi.findById(id).lean();
    if (!mandi) {
      return NextResponse.json({ success: false, message: "Mandi not found" }, { status: 404 });
    }

    const isAdmin    = session.admin.role === "admin";
    const isSubadmin = session.admin.role === "subadmin";

    // Resolve mobile number permission:
    // Admin always sees it. Subadmin only if mandi.allowMobileView === true
    const canSeeMobile = isAdmin || (mandi as any).allowMobileView === true;

    /* ── Permission check for subadmins ── */
    if (isSubadmin) {
      const subAdminsArr: any[] = (mandi as any).subAdmins || [];
      const belongsToMandi = subAdminsArr.some(
        (sid: any) => sid.toString() === session.admin._id.toString()
      );
      if (!belongsToMandi) {
        return NextResponse.json(
          { success: false, message: "You are not assigned to this mandi." },
          { status: 403 }
        );
      }
      if (!(mandi as any).allowPostingView) {
        return NextResponse.json(
          {
            success: false,
            message: "Your admin has not granted permission to view crop postings for this mandi.",
            permissionDenied: true,
          },
          { status: 403 }
        );
      }
    }

    /* ── Query params ── */
    const { searchParams } = new URL(req.url);
    const page        = Math.max(1, Number(searchParams.get("page"))  || 1);
    const limit       = Math.min(100, Number(searchParams.get("limit")) || 10);
    const search      = searchParams.get("search") || "";
    const farmingType = searchParams.get("farmingType") || "";
    const seedType    = searchParams.get("seedType") || "";

    /* ── Find farmers in this mandi's district (and optionally taluka) ── */
    const farmerFilter: any = {
      role: "farmer",
      "personalInfo.district": { $regex: `^${(mandi as any).district}$`, $options: "i" },
      "personalInfo.state":    { $regex: `^${(mandi as any).state}$`,    $options: "i" },
    };

    // If mandi has a taluka, scope to that taluka too
    if ((mandi as any).taluka) {
      farmerFilter["personalInfo.taluk"] = { $regex: `^${(mandi as any).taluka}$`, $options: "i" };
    }

    const farmersInMandi = await Farmer.find(farmerFilter)
      .select("_id farmerId personalInfo")
      .lean();

    if (farmersInMandi.length === 0) {
      const emptyRes: any = {
        success: true, page, limit, totalPages: 0, data: [],
        mandiName: (mandi as any).mandiName,
        district:  (mandi as any).district,
        allowPostingView: (mandi as any).allowPostingView,
      };
      if (isAdmin) emptyRes.total = 0;
      return NextResponse.json(emptyRes);
    }

    /*
     * Posting.farmerId stores either the farmer's MongoDB _id as a string
     * OR a custom farmerId string like "far-001". Collect both so $in covers
     * all cases regardless of what the mobile app stored.
     */
    const farmerIdSet = new Set<string>();
    farmersInMandi.forEach((f: any) => {
      if (f._id)      farmerIdSet.add(f._id.toString());
      if (f.farmerId) farmerIdSet.add(f.farmerId.toString());
    });
    const farmerIdList = Array.from(farmerIdSet);

    /* ── Build crop posting filter ── */
    const postingFilter: any = { farmerId: { $in: farmerIdList } };
    if (farmingType) postingFilter.farmingType = farmingType;
    if (seedType)    postingFilter.seedType    = seedType;

    // Search must stay scoped to these farmers — use $and
    if (search) {
      postingFilter.$and = [
        { farmerId: { $in: farmerIdList } },
        {
          $or: [
            { farmingType: { $regex: search, $options: "i" } },
            { seedType:    { $regex: search, $options: "i" } },
            { farmerId:    { $regex: search, $options: "i" } },
          ],
        },
      ];
      delete postingFilter.farmerId; // moved into $and
    }

    const total    = await Posting.countDocuments(postingFilter);
    const postings = await Posting.find(postingFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    /* ── Farmer lookup map ── */
    const farmerMap = new Map<string, any>();
    farmersInMandi.forEach((f: any) => {
      farmerMap.set(f._id?.toString(), f);
      if (f.farmerId) farmerMap.set(f.farmerId.toString(), f);
    });

    const enrichedPostings = postings.map((posting: any) => {
      const farmer = farmerMap.get(posting.farmerId?.toString()) || null;
      return {
        ...posting,
        farmer: farmer
          ? {
              _id:      farmer._id,
              farmerId: farmer.farmerId,
              name:     farmer.personalInfo?.name || "—",
              // Mask mobile with bullets if admin hasn't granted allowMobileView
              mobileNo: canSeeMobile
                ? (farmer.personalInfo?.mobileNo || "—")
                : "••••••••••",
              village:  farmer.personalInfo?.villageGramaPanchayat || "",
              district: farmer.personalInfo?.district || "",
              state:    farmer.personalInfo?.state    || "",
              taluk:    farmer.personalInfo?.taluk    || "",
            }
          : null,
      };
    });

    /* ── Response: total count only sent to admin ── */
    const response: any = {
      success: true,
      page,
      limit,
      totalPages:       Math.ceil(total / limit) || 1,
      data:             enrichedPostings,
      mandiName:        (mandi as any).mandiName,
      district:         (mandi as any).district,
      allowPostingView: (mandi as any).allowPostingView,
      allowMobileView:  (mandi as any).allowMobileView,
    };
    if (isAdmin) response.total = total;   // subadmin never sees the count

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("GET /api/mandi/[id]/postings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch postings" },
      { status: 500 }
    );
  }
}