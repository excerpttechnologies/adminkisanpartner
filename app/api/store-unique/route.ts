// // import dbConnect from "@/app/lib/Db";
// // import StatesDetails from "@/app/models/StatesDetails";
// // import Farmer from "@/app/models/Farmer";


// import dbConnect from "@/app/lib/Db";
// import StatesDetails from "@/app/models/StatesDetails";
// import Farmer from "@/app/models/Farmer";
// import { NextRequest, NextResponse } from "next/server";
// import Tranporter from "@/app/models/Tranporter";

// interface FarmerPersonalInfo {
//   name: string;
//   mobileNo: string;
//   email: string;
//   address: string;
//   villageGramaPanchayat: string;
//   pincode: string;
//   state: string;
//   district: string;
//   taluk: string;
//   post: string;
// }

// interface FarmerDocument {
//   _id: string;
//   farmerId?: string;
//   traderId?: string;
//   personalInfo: FarmerPersonalInfo;
//   role: string;
//   [key: string]: any;
// }

// export async function GET(request: NextRequest) {
//   try {
//     // Connect to database
//     await dbConnect();

//     // Fetch all farmers from the database
//     const farmers = await Farmer.find({ }) as FarmerDocument[];

//     if (!farmers || farmers.length === 0) {
//       return NextResponse.json(
//         { message: "No farmers found" },
//         { status: 404 }
//       );
//     }

//     // Create a map to store unique pincodes with their state/district/taluk data
//     const pincodeMap = new Map<string, {
//       pinCode: string;
//       state: string;
//       district: string;
//       taluk: string;
//     }>();

//     // Loop through all farmers to collect unique pincode data
//     farmers.forEach((farmer: FarmerDocument) => {
//       const { personalInfo } = farmer;
      
//       if (personalInfo && personalInfo.pincode) {
//         const pinCode = personalInfo.pincode.trim();
        
//         if (pinCode && !pincodeMap.has(pinCode)) {
//           pincodeMap.set(pinCode, {
//             pinCode,
//             state: personalInfo.state || 'Unknown',
//             district: personalInfo.district || 'Unknown',
//             taluk: personalInfo.taluk || 'Unknown'
//           });
//         }
//       }
//     });

//     // Check if there are any pincodes to process
//     if (pincodeMap.size === 0) {
//       return NextResponse.json(
//         { message: "No valid pincodes found in farmer data" },
//         { status: 400 }
//       );
//     }

//     const results = [];
//     const errors = [];

//     // Process each unique pincode
//     for (const [pinCode, locationData] of pincodeMap) {
//       try {
//         // Check if pincode already exists in StatesDetails
//         const existingRecord = await StatesDetails.findOne({ pinCode });

//         if (existingRecord) {
//           // Update existing record if needed
//           if (existingRecord.state !== locationData.state ||
//               existingRecord.district !== locationData.district ||
//               existingRecord.taluk !== locationData.taluk) {
            
//             await StatesDetails.findByIdAndUpdate(
//               existingRecord._id,
//               {
//                 state: locationData.state,
//                 district: locationData.district,
//                 taluk: locationData.taluk
//               },
//               { new: true }
//             );
            
//             results.push({
//               pinCode,
//               action: 'updated',
//               data: locationData
//             });
//           } else {
//             results.push({
//               pinCode,
//               action: 'already_exists',
//               data: locationData
//             });
//           }
//         } else {
//           // Create new record
//           const newStateDetail = await StatesDetails.create({
//             pinCode: locationData.pinCode,
//             state: locationData.state,
//             district: locationData.district,
//             taluk: locationData.taluk
//           });

//           results.push({
//             pinCode,
//             action: 'created',
//             data: newStateDetail
//           });
//         }
//       } catch (error: any) {
//         errors.push({
//           pinCode,
//           error: error.message
//         });
//       }
//     }

//     // Prepare response
//     const response = {
//       message: "State details processed successfully",
//       transporter:await Tranporter.find({}),
//       summary: {
//         totalFarmers: farmers.length,
//         uniquePincodes: pincodeMap.size,
//         successful: results.length,
//         failed: errors.length
//       },
//       results,
//       errors: errors.length > 0 ? errors : undefined
//     };

//     return NextResponse.json(response, { status: 200 });

//   } catch (error: any) {
//     console.error("Error processing state details:", error);
    
//     return NextResponse.json(
//       { 
//         message: "Internal server error",
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }





import dbConnect from "@/app/lib/Db";
import StatesDetails from "@/app/models/StatesDetails";
import Farmer from "@/app/models/Farmer";
import Transporter from "@/app/models/Transporter";
import { NextRequest, NextResponse } from "next/server";
import { Document, Types } from "mongoose";

// Interface definitions
interface PersonalInfo {
  name: string;
  mobileNo: string;
  email: string;
  address: string;
  villageGramaPanchayat: string;
  pincode: string;
  state: string;
  district: string;
  taluk: string;
  post: string;
  location?: string;
}


interface CreatedStatesDetails {
  _id: Types.ObjectId;
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
  source?: string[];
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

// Define interfaces for the documents
interface IFarmerDocument extends Document {
  _id: Types.ObjectId;
  farmerId?: string;
  traderId?: string;
  transporterId?: string;
  personalInfo: PersonalInfo;
  role: string;
  [key: string]: any;
}

interface ITransporterDocument extends Document {
  _id: Types.ObjectId;
  transporterId?: string;
  personalInfo: PersonalInfo;
  role: string;
  [key: string]: any;
}

interface IStatesDetailsDocument extends Document {
  _id: Types.ObjectId;
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
  source?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface LocationData {
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
  source: string[];
}

interface ProcessingResult {
  pinCode: string;
  action: 'created' | 'updated' | 'already_exists';
  data: LocationData;
}

interface ProcessingError {
  pinCode: string;
  error: string;
}

interface StateDetailResponse {
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
  createdAt: Date;
}

interface ApiResponse {
  message: string;
  summary: {
    totalFarmers: number;
    totalTraders: number;
    totalTransporters: number;
    totalRecords: number;
    uniquePincodes: number;
    successful: number;
    failed: number;
  };
  statistics: {
    farmersByState: Record<string, number>;
    tradersByState: Record<string, number>;
    transportersByState: Record<string, number>;
  };
  results: ProcessingResult[];
  errors?: ProcessingError[];
  newStateDetails: StateDetailResponse[];
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    console.log("Starting state details synchronization...");

    // Fetch all farmers and traders
    const farmers = await Farmer.find({ 
      $or: [{ role: 'farmer' }, { role: 'trader' }]
    }) as IFarmerDocument[];

    // Fetch all transporters
    const transporters = await Transporter.find({ role: 'transport' }) as ITransporterDocument[];

    const totalFarmers = farmers.filter(f => f.role === 'farmer').length;
    const totalTraders = farmers.filter(f => f.role === 'trader').length;
    const totalTransporters = transporters.length;
    const totalRecords = farmers.length + transporters.length;

    if (totalRecords === 0) {
      return NextResponse.json(
        { message: "No data found (farmers, traders, or transporters)" },
        { status: 404 }
      );
    }

    console.log(`Found ${totalFarmers} farmers, ${totalTraders} traders, and ${totalTransporters} transporters`);

    // Create a map to store unique pincodes with their state/district/taluk data
    const pincodeMap = new Map<string, LocationData>();

    // Statistics tracking
    const farmersByState: Record<string, number> = {};
    const tradersByState: Record<string, number> = {};
    const transportersByState: Record<string, number> = {};

    // Process farmers and traders
    farmers.forEach((record: IFarmerDocument) => {
      const { personalInfo, role } = record;
      
      if (personalInfo && personalInfo.pincode && personalInfo.state) {
        const pinCode = personalInfo.pincode.trim();
        const state = personalInfo.state.trim();
        
        if (pinCode && state) {
          // Update statistics
          if (role === 'farmer') {
            farmersByState[state] = (farmersByState[state] || 0) + 1;
          } else if (role === 'trader') {
            tradersByState[state] = (tradersByState[state] || 0) + 1;
          }
          
          if (!pincodeMap.has(pinCode)) {
            pincodeMap.set(pinCode, {
              pinCode,
              state: state || 'Unknown',
              district: personalInfo.district?.trim() || 'Unknown',
              taluk: personalInfo.taluk?.trim() || 'Unknown',
              source: [role]
            });
          } else {
            const existing = pincodeMap.get(pinCode)!;
            // Update if we have more complete information
            if (existing.state === 'Unknown' && state !== 'Unknown') {
              existing.state = state;
            }
            if (existing.district === 'Unknown' && personalInfo.district) {
              existing.district = personalInfo.district.trim();
            }
            if (existing.taluk === 'Unknown' && personalInfo.taluk) {
              existing.taluk = personalInfo.taluk.trim();
            }
            if (!existing.source.includes(role)) {
              existing.source.push(role);
            }
          }
        }
      }
    });

    // Process transporters
    transporters.forEach((transporter: ITransporterDocument) => {
      const { personalInfo, role } = transporter;
      
      if (personalInfo && personalInfo.pincode && personalInfo.state) {
        const pinCode = personalInfo.pincode.trim();
        const state = personalInfo.state.trim();
        
        if (pinCode && state) {
          // Update statistics
          transportersByState[state] = (transportersByState[state] || 0) + 1;
          
          if (!pincodeMap.has(pinCode)) {
            pincodeMap.set(pinCode, {
              pinCode,
              state: state || 'Unknown',
              district: personalInfo.district?.trim() || 'Unknown',
              taluk: personalInfo.taluk?.trim() || 'Unknown',
              source: [role]
            });
          } else {
            const existing = pincodeMap.get(pinCode)!;
            // Update if we have more complete information
            if (existing.state === 'Unknown' && state !== 'Unknown') {
              existing.state = state;
            }
            if (existing.district === 'Unknown' && personalInfo.district) {
              existing.district = personalInfo.district.trim();
            }
            if (existing.taluk === 'Unknown' && personalInfo.taluk) {
              existing.taluk = personalInfo.taluk.trim();
            }
            if (!existing.source.includes(role)) {
              existing.source.push(role);
            }
          }
        }
      }
    });

    // Check if there are any pincodes to process
    if (pincodeMap.size === 0) {
      return NextResponse.json(
        { message: "No valid pincodes found in the data" },
        { status: 400 }
      );
    }

    console.log(`Processing ${pincodeMap.size} unique pincodes...`);

    const results: ProcessingResult[] = [];
    const errors: ProcessingError[] = [];
    const newStateDetails: StateDetailResponse[] = [];

    // Process each unique pincode
    for (const [pinCode, locationData] of pincodeMap) {
      try {
        // Check if pincode already exists in StatesDetails
        const existingRecord = await StatesDetails.findOne({ pinCode }) as IStatesDetailsDocument | null;

        if (existingRecord) {
          // Check if update is needed
          const needsUpdate = 
            existingRecord.state !== locationData.state ||
            existingRecord.district !== locationData.district ||
            existingRecord.taluk !== locationData.taluk;

          if (needsUpdate) {
            const updatedRecord = await StatesDetails.findByIdAndUpdate(
              existingRecord._id,
              {
                state: locationData.state,
                district: locationData.district,
                taluk: locationData.taluk,
                source: locationData.source,
                updatedAt: new Date()
              },
              { new: true, runValidators: true }
            ) as IStatesDetailsDocument;
            
            results.push({
              pinCode,
              action: 'updated',
              data: locationData
            });
            
            newStateDetails.push({
              pinCode: updatedRecord.pinCode,
              state: updatedRecord.state,
              district: updatedRecord.district,
              taluk: updatedRecord.taluk,
              createdAt: updatedRecord.createdAt
            });
          } else {
            results.push({
              pinCode,
              action: 'already_exists',
              data: locationData
            });
          }
        } else {
          // Create new record

          // @ts-ignore
       const newStateDetail = await StatesDetails.create({
        pinCode: locationData.pinCode,
        state: locationData.state,
        district: locationData.district,
        taluk: locationData.taluk,
        source: locationData.source
       }) as any;

          results.push({
            pinCode,
            action: 'created',
            data: locationData
          });

          // @ts-ignore
          newStateDetails.push({
            pinCode: newStateDetail.pinCode,
            state: newStateDetail.state,
            district: newStateDetail.district,
            taluk: newStateDetail.taluk,
            createdAt: newStateDetail.createdAt
          });
        }
      } catch (error: any) {
        console.error(`Error processing pincode ${pinCode}:`, error);
        errors.push({
          pinCode,
          error: error.message || 'Unknown error'
        });
      }
    }

    // Prepare response
    const response: ApiResponse = {
      message: "State details synchronized successfully",
      summary: {
        totalFarmers,
        totalTraders,
        totalTransporters,
        totalRecords,
        uniquePincodes: pincodeMap.size,
        successful: results.length,
        failed: errors.length
      },
      statistics: {
        farmersByState,
        tradersByState,
        transportersByState
      },
      results,
      newStateDetails,
      ...(errors.length > 0 && { errors })
    };

    console.log("Synchronization completed successfully");

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error: any) {
    console.error("Error processing state details:", error);
    
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

