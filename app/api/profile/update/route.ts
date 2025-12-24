import { NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

/* ================= UPDATE PROFILE ================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔐 READ TOKEN FROM COOKIE
    const cookie = req.headers.get("cookie");
    if (!cookie) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔓 VERIFY TOKEN
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const { fullName, password } = await req.json();

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { message: "Full Name is required" },
        { status: 400 }
      );
    }

  const updateData: Partial<{
  fullName: string;
  password: string;
}> = {
  fullName: fullName.trim(),
};


    // 🔑 Update password only if provided
    if (password && password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
