// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import B2BUser from '@/app/models/b2bUsers';

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }   // id = user ID
// ) {
//   try {
//     await connectDB();
//     const userId = params.id;
//     const { docId, status, rejectionReason } = await request.json();

//     if (!docId) {
//       return NextResponse.json(
//         { success: false, message: 'docId is required' },
//         { status: 400 }
//       );
//     }
//     if (!['pending', 'verified', 'rejected'].includes(status)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid status value' },
//         { status: 400 }
//       );
//     }

//     const user = await B2BUser.findById(userId);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const doc = user.kycDocuments.id(docId);
//     if (!doc) {
//       return NextResponse.json(
//         { success: false, message: 'KYC document not found' },
//         { status: 404 }
//       );
//     }

//     doc.status = status;
//     if (status === 'rejected' && rejectionReason) {
//       doc.rejectionReason = rejectionReason;
//     } else {
//       doc.rejectionReason = '';
//     }

//     // Recompute overall verification status
//     const allDocs = user.kycDocuments;
//     if (allDocs.every(d => d.status === 'verified')) {
//       user.verificationStatus = 'verified';
//     } else if (allDocs.some(d => d.status === 'rejected')) {
//       user.verificationStatus = 'rejected';
//     } else {
//       user.verificationStatus = 'pending';
//     }

//     if (status === 'verified') {
//       user.verifiedBy = request.headers.get('x-admin-name') || 'Admin';
//       user.verifiedDate = new Date().toISOString();
//     }

//     await user.save();

//     return NextResponse.json({
//       success: true,
//       message: 'KYC status updated',
//       updatedDocument: doc,
//       overallStatus: user.verificationStatus,
//     });
//   } catch (error: any) {
//     console.error('[PATCH /api/kyc/:id]', error);
//     return NextResponse.json(
//       { success: false, message: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }






import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import B2BUser from '@/app/models/b2bUsers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // id = user ID
) {
  try {
    await connectDB();
    const { id: userId } = await params; // ✅ params must be awaited in Next.js 15
    const { docId, status, rejectionReason } = await request.json();

    if (!docId) {
      return NextResponse.json(
        { success: false, message: 'docId is required' },
        { status: 400 }
      );
    }
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    const user = await B2BUser.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const doc = user.kycDocuments.id(docId);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'KYC document not found' },
        { status: 404 }
      );
    }

    doc.status = status;
    if (status === 'rejected' && rejectionReason) {
      doc.rejectionReason = rejectionReason;
    } else {
      doc.rejectionReason = '';
    }

    // Recompute overall verification status
    const allDocs = user.kycDocuments;
    if (allDocs.every((d: any) => d.status === 'verified')) {
      user.verificationStatus = 'verified';
    } else if (allDocs.some((d: any) => d.status === 'rejected')) {
      user.verificationStatus = 'rejected';
    } else {
      user.verificationStatus = 'pending';
    }

    if (status === 'verified') {
      user.verifiedBy = request.headers.get('x-admin-name') || 'Admin';
      user.verifiedDate = new Date().toISOString();
    }

    // ✅ Only validate the paths that were actually modified (kycDocuments,
    // verificationStatus, verifiedBy, verifiedDate). This avoids failing on
    // unrelated stale/legacy fields like businessType that may hold values
    // no longer in the current enum (e.g. "caterer").
    await user.save({ validateModifiedOnly: true });

    return NextResponse.json({
      success: true,
      message: 'KYC status updated',
      updatedDocument: doc,
      overallStatus: user.verificationStatus,
    });
  } catch (error: any) {
    console.error('[PATCH /api/kyc/:id]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}