// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Farmer from "@/app/models/Farmer";

// /* ================= VIEW ================= */
// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//      const {id}=await params
//   await connectDB();
//   const farmer = await Farmer.findById(id);

//   if (!farmer) {
//     return NextResponse.json({ success: false }, { status: 404 });
//   }

//   return NextResponse.json({ success: true, data: farmer });
// }

// /* ================= UPDATE / APPROVE ================= */
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//      const {id}=await params
//   await connectDB();
//   const body = await req.json();

//   const updated = await Farmer.findByIdAndUpdate(
//     id,
//     body,
//     { new: true }
//   );

//   if (!updated) {
//     return NextResponse.json({ success: false }, { status: 404 });
//   }

//   return NextResponse.json({ success: true, data: updated });
// }

// /* ================= DELETE ================= */
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//     const {id}=await params
//     console.log(id)
//   await connectDB();
//   await Farmer.findByIdAndDelete(id);

//   return NextResponse.json({ success: true });
// }

















import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Farmer from "@/app/models/Farmer";
import bcrypt from "bcryptjs";

/* ================= VIEW ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
     const {id}=await params
  await connectDB();
  const farmer = await Farmer.findById(id);

  if (!farmer) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: farmer });
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") === "true";

    await connectDB();
    const body = await req.json();

    let updated;

    /* ================= STATUS UPDATE ONLY ================= */
    if (status) {
      updated = await Farmer.findByIdAndUpdate(
        id,
        { $set: { registrationStatus: body.registrationStatus } },
        { new: true }
      );
    } else {
      const mobileNo = body.personalInfo?.mobileNo;
      const role = body.role || "farmer";

      /* ================= PASSWORD VALIDATION ================= */
      if (body?.security?.password && body.security.password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      /* ================= MOBILE VALIDATION ================= */
      if (mobileNo) {
        if (mobileNo.length !== 10) {
          return NextResponse.json(
            { success: false, message: "Mobile number must be 10 digits" },
            { status: 400 }
          );
        }

        const existingUser = await Farmer.findOne({
          "personalInfo.mobileNo": mobileNo,
          role,
          _id: { $ne: id },
        });

        if (existingUser) {
          return NextResponse.json(
            { success: false, message: "Mobile number already exists" },
            { status: 409 }
          );
        }
      }

      /* ================= SAFE UPDATE OBJECT ================= */
      const setData: any = {};

      // normal fields
      Object.keys(body).forEach((key) => {
        if (key !== "security") {
          setData[key] = body[key];
        }
      });

      // security fields (NO overwrite)
      if (body.security?.password) {
        setData["security.password"] = await bcrypt.hash(
          body.security.password,
          10
        );
      }

      if (body.security?.mpin) {
        setData["security.mpin"] = await bcrypt.hash(
          body.security.mpin,
          10
        );
      }

      if (body.security?.referralCode !== undefined) {
        setData["security.referralCode"] = body.security.referralCode;
      }

      updated = await Farmer.findByIdAndUpdate(
        id,
        { $set: setData },
        { new: true }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


/* ================= DELETE ================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const {id}=await params
    console.log(id)
  await connectDB();
  await Farmer.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}




