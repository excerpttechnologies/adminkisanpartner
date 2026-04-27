// // app/api/users/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import User from '@/app/models/UserVerification';
// import mongoose from 'mongoose';

// // ── PATCH /api/users/:id ─────────────────────────────────────────────────────
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { id } = params;

//     // Validate ObjectId format before querying
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, message: `Invalid user ID format: ${id}` },
//         { status: 400 }
//       );
//     }

//     const body = await req.json();
//     const { status, rejectionReason, verifiedBy } = body;

//     if (!['verified', 'rejected'].includes(status)) {
//       return NextResponse.json(
//         { success: false, message: 'status must be "verified" or "rejected"' },
//         { status: 400 }
//       );
//     }

//     if (status === 'rejected' && !rejectionReason?.trim()) {
//       return NextResponse.json(
//         { success: false, message: 'rejectionReason is required when rejecting' },
//         { status: 400 }
//       );
//     }

//     const updatePayload: Record<string, unknown> = {
//       verificationStatus: status,
//       verifiedBy: verifiedBy || 'Admin',
//       verifiedDate: new Date().toISOString(),
//       rejectionReason: status === 'rejected' ? rejectionReason : '',
//     };

//     // Use findOneAndUpdate with _id filter — more explicit than findByIdAndUpdate
//     const updated = await User.findOneAndUpdate(
//       { _id: new mongoose.Types.ObjectId(id) },
//       { $set: updatePayload },
//       { new: true, upsert: false }
//     )
//       .select('-security')
//       .lean();

//     if (!updated) {
//       // Debug: check if user exists at all
//       const exists = await User.findOne({ _id: new mongoose.Types.ObjectId(id) }).lean();
//       console.error('[PATCH] User lookup result:', exists);
//       return NextResponse.json(
//         { success: false, message: `User not found with id: ${id}` },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: `User ${status} successfully`, data: updated },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error('[PATCH /api/users/:id]', error);
//     return NextResponse.json(
//       { success: false, message: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // ── GET /api/users/:id ───────────────────────────────────────────────────────
// export async function GET(
//   request: NextRequest,
//   context: { params: Awaited<{ id: string }> }
// ): Promise<Response> {
//   try {
//     const { params } = context;
//     await connectDB();

//     const user = await User.findById(params.id).select('-security').lean();
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, data: user }, { status: 200 });
//   } catch (error: any) {
//     console.error('[GET /api/users/:id]', error);
//     return NextResponse.json(
//       { success: false, message: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // ── DELETE /api/users/:id ────────────────────────────────────────────────────
// export async function DELETE(
//   _req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { id } = params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, message: `Invalid user ID format: ${id}` },
//         { status: 400 }
//       );
//     }

//     const deleted = await User.findByIdAndDelete(id).lean();

//     if (!deleted) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: 'User deleted successfully' },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error('[DELETE /api/users/:id]', error);
//     return NextResponse.json(
//       { success: false, message: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }














//updated by sagar
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import User from '@/app/models/UserVerification';
import mongoose from 'mongoose';

// ── PATCH /api/users/:id ─────────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: `Invalid user ID format: ${id}` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, rejectionReason, verifiedBy } = body;

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'status must be "verified" or "rejected"' },
        { status: 400 }
      );
    }

    if (status === 'rejected' && !rejectionReason?.trim()) {
      return NextResponse.json(
        { success: false, message: 'rejectionReason is required when rejecting' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      verificationStatus: status,
      verifiedBy: verifiedBy || 'Admin',
      verifiedDate: new Date().toISOString(),
      rejectionReason: status === 'rejected' ? rejectionReason : '',
    };

    const updated = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updatePayload },
      { new: true, upsert: false }
    )
      .select('-security')
      .lean();

    if (!updated) {
      const exists = await User.findOne({ _id: new mongoose.Types.ObjectId(id) }).lean();
      console.error('[PATCH] User lookup result:', exists);

      return NextResponse.json(
        { success: false, message: `User not found with id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: `User ${status} successfully`, data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PATCH /api/users/:id]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ── GET /api/users/:id ───────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const user = await User.findById(id).select('-security').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[GET /api/users/:id]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ── DELETE /api/users/:id ────────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: `Invalid user ID format: ${id}` },
        { status: 400 }
      );
    }

    const deleted = await User.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[DELETE /api/users/:id]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}