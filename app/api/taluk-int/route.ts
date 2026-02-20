// import { NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Pincode, { IPincode } from "@/app/models/Pincode";
// import data from "@/app/config/all-india-pincode-json-array.json";

// export async function GET() {
//   try {
//     await connectDB();

//     // Check if already inserted
//     const count: number = await Pincode.countDocuments();

//     const unique=await Pincode.aggregate([
//   {
//     "$group": {
//       "_id": "$pincode"
//     }
//   },
//   {
//     "$count": "totalUniquePincodes"
//   }
// ]
// )
//     if (count > 0) {
//       return NextResponse.json({
//         success: true,
//         message: "Data already inserted",
//         totalRecords: count,
//         unique
//       });
//     }

//     // Insert ALL JSON data directly
//     await Pincode.insertMany(data as IPincode[], {
//       ordered: false, // Prevent crash if duplicates exist
//     });

//     return NextResponse.json({
//       success: true,
//       message: "All pincode data inserted successfully",
//     //   totalInserted: data.length,
//     });
//   } catch (error: unknown) {
//     console.error("Insert Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Something went wrong",
//       },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Pincode, { IPincode } from "@/app/models/Pincode";
import data from "@/app/config/all-india-pincode-json-array.json";

export async function GET() {
  try {
    await connectDB();

    const count = await Pincode.countDocuments();

    if (count > 0) {
      const uniqueCount = await Pincode.countDocuments();
      return NextResponse.json({
        success: true,
        message: "Data already inserted",
        totalUniqueStored: uniqueCount,
      });
    }

    // 🔥 Remove duplicate pincodes before inserting
    const uniqueMap = new Map<number, IPincode>();

    (data as IPincode[]).forEach((item) => {
      if (!uniqueMap.has(item.pincode)) {
        uniqueMap.set(item.pincode, item);
      }
    });

    const uniqueData = Array.from(uniqueMap.values());

    await Pincode.insertMany(uniqueData);

    const deleteinfo=[
      {statename:"ANDAMAN & NICOBAR ISLANDS"},
      {statename:"DADRA & NAGAR HAVELI"},
      {statename:"DAMAN & DIU"},
      {statename:"NULL"},
      {statename:"PONDICHERRY"},
       {statename:"CHANDIGARH"},
      // {statename:""},
      // {statename:""},
    ]

    await Pincode.deleteMany({$or:deleteinfo})
    

    return NextResponse.json({
      success: true,
      message: "Only unique pincode data inserted",
      totalInserted: uniqueData.length,
    });
  } catch (error: unknown) {
    console.error("Insert Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
