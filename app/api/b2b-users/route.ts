
import connectDB from '@/app/lib/Db';
import B2BUser from '@/app/models/b2bUsers';
import { NextRequest, NextResponse } from 'next/server';


// export async function GET(
//   request: NextRequest,) {
//   try {
//     await connectDB();
  
    
//     const users = await B2BUser.find({}).select('-security.password -security.mpin');
    
//     if (!users || users.length === 0) {
//       return NextResponse.json(
//         { success: false, message: 'No users found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       users
//     });
    
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }



export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // ── raw params ────────────────────────────────────────────────
    const search             = searchParams.get("search")             || "";
    const verificationStatus = searchParams.get("verificationStatus") || "";
    const isActiveParam      = searchParams.get("isActive")           || "";
    const businessType       = searchParams.get("businessType")       || "";
    const sortBy             = searchParams.get("sortBy")             || "createdAt";
    const sortOrder          = searchParams.get("sortOrder")          || "desc";
    const page               = Math.max(1, parseInt(searchParams.get("page")  || "1",  10));
    const limit              = Math.max(0, parseInt(searchParams.get("limit") || "0",  10));

    // ── build query ───────────────────────────────────────────────
    const query: Record<string, any> = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { businessName:  regex },
        { name:          regex },
        { mobileNumber:  regex },
        { email:         regex },
        { gstNumber:     regex },
        { district:      regex },
        { state:         regex },
      ];
    }

    if (verificationStatus && ["pending", "verified", "rejected"].includes(verificationStatus)) {
      query.verificationStatus = verificationStatus;
    }

    if (isActiveParam === "true")  query.isActive = true;
    if (isActiveParam === "false") query.isActive = false;

    if (businessType) query.businessType = businessType;

    // ── allowed sort fields (whitelist) ───────────────────────────
    const allowedSortFields = [
      "businessName", "name", "mobileNumber", "verificationStatus",
      "isActive", "createdAt", "updatedAt",
    ];
    const safeSortBy    = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const safeSortOrder = sortOrder === "asc" ? 1 : -1;
const sort: Record<string, 1 | -1> = {
  [safeSortBy]: safeSortOrder as 1 | -1,
};
    // ── query execution ───────────────────────────────────────────
    const baseQuery = B2BUser.find(query)
      .select("-security.password -security.mpin")
      .sort(sort);

    const total = await B2BUser.countDocuments(query);

    let users;
    if (limit > 0) {
      const skip = (page - 1) * limit;
      users = await baseQuery.skip(skip).limit(limit).lean();
    } else {
      users = await baseQuery.lean();
    }

    // ── aggregated stats (always on full collection) ──────────────
    const [statsRaw] = await B2BUser.aggregate([
      {
        $group: {
          _id: null,
          total:    { $sum: 1 },
          verified: { $sum: { $cond: [{ $eq: ["$verificationStatus", "verified"] }, 1, 0] } },
          pending:  { $sum: { $cond: [{ $eq: ["$verificationStatus", "pending"]  }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$verificationStatus", "rejected"] }, 1, 0] } },
          active:   { $sum: { $cond: ["$isActive", 1, 0] } },
          inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
        },
      },
    ]);

    const stats = statsRaw
      ? {
          total:    statsRaw.total,
          verified: statsRaw.verified,
          pending:  statsRaw.pending,
          rejected: statsRaw.rejected,
          active:   statsRaw.active,
          inactive: statsRaw.inactive,
        }
      : { total: 0, verified: 0, pending: 0, rejected: 0, active: 0, inactive: 0 };

    // ── distinct business types for filter dropdown ───────────────
    const businessTypes: string[] = await B2BUser.distinct("businessType");

    return NextResponse.json({
      success: true,
      users,
      stats,
      businessTypes: businessTypes.filter(Boolean).sort(),
      pagination: limit > 0
        ? { total, page, limit, totalPages: Math.ceil(total / limit) }
        : { total, page: 1, limit: total, totalPages: 1 },
    });

  } catch (error: any) {
    console.error("[GET /api/b2b-users]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}