// import connectDB from "@/app/lib/Db";
// import Pincode from "@/app/models/Pincode";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const state = searchParams.get("state");
//     const district = searchParams.get("district");
//     const taluk = searchParams.get("taluk");
//     const pincode = searchParams.get("pincode");

//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 0;

//     const filter: any = {};

//     // 🔎 State filter
//     if (state) {
//       filter.statename = { $regex: state, $options: "i" };
//     }

//     // 🔎 District filter
//     if (district) {
//       filter.Districtname = { $regex: district, $options: "i" };
//     }

//     // 🔎 Taluk filter
//     if (taluk) {
//       filter.Taluk = { $regex: taluk, $options: "i" };
//     }

//     // 🔎 Pincode filter (exact match)
//     if (pincode) {
//       filter.pincode = Number(pincode);
//     }

//     const skip = (page - 1) * limit;

//     const data = await Pincode.find(filter)
//       .select("Districtname Taluk pincode statename")
//       .skip(skip)
//       .limit(limit);

//     const total = await Pincode.countDocuments(filter);

//     return NextResponse.json({
//       success: true,
//       message: "Get success",
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data,
//     });
//   } catch (error) {
//     console.log("Error in pincode filter API", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Something went wrong",
//       },
//       { status: 500 }
//     );
//   }
// }










import connectDB from "@/app/lib/Db";
import Pincode from "@/app/models/Pincode";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type"); // state | district | taluk
    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const taluk = searchParams.get("taluk");
    const pincode = searchParams.get("pincode");

    const limit = Number(searchParams.get("limit")) || 20;

    const filter: any = {};

    // 🔎 State filter
    if (state) {
      filter.statename = { $regex: state, $options: "i" };
    }

    // 🔎 District filter
    if (district) {
      filter.Districtname = { $regex: district, $options: "i" };
    }

    // 🔎 Taluk filter
    if (taluk) {
      filter.Taluk = { $regex: taluk, $options: "i" };
    }

    // 🔎 Pincode exact filter
    if (pincode) {
      filter.pincode = Number(pincode);
    }

    // ================================
    // 🎯 HANDLE DROPDOWN DISTINCT CASE
    // ================================

    if (type === "state") {
      const states = await Pincode.distinct("statename", filter);

      return NextResponse.json({
        success: true,
        data: states.slice(0, limit),
      });
    }

    if (type === "district") {
      const districts = await Pincode.distinct("Districtname", filter);

      return NextResponse.json({
        success: true,
        data: districts.slice(0, limit),
      });
    }

    if (type === "taluk") {
      const taluks = await Pincode.distinct("Taluk", filter);

      return NextResponse.json({
        success: true,
        data: taluks.slice(0, limit),
      });
    }

    // ================================
    // 📄 DEFAULT: RETURN PINCODE DATA
    // ================================

    const data = await Pincode.find(filter)
      .select("Districtname Taluk pincode statename")
      .limit(limit);

    const total = await Pincode.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: "Get success",
      total,
      data,
    });

  } catch (error) {
    console.log("Error in pincode filter API", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
