// import { NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Pincode from "@/app/models/Pincode";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const { statename, Districtname, Taluk } = await req.json();

//     if (!statename || !Districtname || !Taluk) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const newData = await Pincode.create({
//       statename,
//       Districtname,
//       Taluk,
//     });

//     return NextResponse.json({
//       success: true,
//       data: newData,
//       message: "Manual Data Added Successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import StatesDetails from "@/app/models/StatesDetails";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { statename, Districtname, Taluk } = await req.json();

    if (!statename || !Districtname || !Taluk) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }



    console.log("////////////////",statename,Districtname,Taluk)
    const newData = await StatesDetails.create({
      state:statename,
      district:Districtname,
      
      taluk:Taluk,  
      ismanual:true,
    });

    return NextResponse.json({
      success: true,
      data: newData,
      message: "Manual Data Added Successfully",
    });

  } catch (error: any) {
    console.log("MANUAL INSERT ERROR:", error.message); // 👈 check terminal now
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}