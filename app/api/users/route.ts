// // app/api/users/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import  connectDB  from '@/app/lib/Db';
// import User from '@/app/models/UserVerification';

// // ── GET /api/users ──────────────────────────────────────────────────────────
// // Query params:
// //   ?status=pending|verified|rejected   (optional — omit for all users)
// //   ?role=b2b_buyer                     (optional)
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const status = searchParams.get('status');
//     const role   = searchParams.get('role');

//     // Build filter
//     const filter: Record<string, unknown> = {};
//     if (status) filter.verificationStatus = status;
//     if (role)   filter.role = role;

//     const users = await User.find(filter)
//       .select('-security')           // never send passwords / mpins to client
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json({ success: true, data: users }, { status: 200 });
//   } catch (error: any) {
//     console.error('[GET /api/users]', error);
//     return NextResponse.json(
//       { success: false, message: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }












// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/app/lib/Db';
import User from '@/app/models/UserVerification';

// ── GET /api/users ──────────────────────────────────────────────────────────
// Query params:
//   ?status=pending|verified|rejected   (optional — omit for all users)
//   ?role=b2b_buyer                     (optional)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const role   = searchParams.get('role');

    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.verificationStatus = status;
    if (role)   filter.role = role;

    const users = await User.find(filter)
      .select('-security')      // never send passwords / mpins to client
      .sort({ createdAt: -1 })
      .limit(0)                 // 0 = no limit → returns ALL documents
      .lean();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    console.error('[GET /api/users]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}