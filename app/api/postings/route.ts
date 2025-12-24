import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";

/* ================= CREATE ================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    // console.log(body)
    const posting = await Posting.create(body);

    return NextResponse.json({ success: true, data: posting });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Create failed" },
      { status: 500 }
    );
  }
}

/* ================= GET (LIST) ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const filter: any = {};

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { item: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { "postedBy.name": { $regex: search, $options: "i" } },
         { "postedBy.mobile": { $regex: search, $options: "i" } },
         { acres: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    const total = await Posting.countDocuments(filter);

    const data = await Posting.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data,
    });
  } catch (error) {
    console.error("Error fetching postings:", error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 }
    );
  }
}
