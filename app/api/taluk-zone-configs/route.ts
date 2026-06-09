


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import TalukZoneConfig from "@/app/models/TalukZoneConfig";

export async function GET() {
  try {
    await connectDB();
    const configs = await TalukZoneConfig.find().lean();
    return NextResponse.json({ success: true, configs });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch configs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { configs } = body as {
      configs: Array<{
        level: "state" | "district" | "taluk";
        state: string;
        district: string;
        taluk: string;
        commodityRanges: unknown[];
      }>;
    };

    if (!Array.isArray(configs)) {
      return NextResponse.json(
        { success: false, error: "configs must be an array" },
        { status: 400 }
      );
    }

    for (const config of configs) {
      const level    = config.level    ?? "taluk";
      const state    = config.state    ?? "";
      const district = config.district ?? "";
      const taluk    = config.taluk    ?? "";

      await TalukZoneConfig.findOneAndUpdate(
        { level, state, district, taluk },
        { ...config, level, state, district, taluk },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to save config" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const level    = searchParams.get("level")    ?? "taluk";
    const state    = searchParams.get("state")    ?? "";
    const district = searchParams.get("district") ?? "";
    const taluk    = searchParams.get("taluk")    ?? "";

    await TalukZoneConfig.findOneAndDelete({ level, state, district, taluk });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete config" },
      { status: 500 }
    );
  }
}