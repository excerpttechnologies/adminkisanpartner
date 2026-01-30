
// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface ILabour extends Document {
//   name: string;
//   villageName: string;
//   contactNumber: string;
//   email: string;

//   workTypes: string[];
//   experience: string;
//   availability: string;
//   address: string;

//   maleRequirement: number;
//   femaleRequirement: number;

//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const LabourSchema: Schema<ILabour> = new Schema(
//   {
//     name: { type: String, required: true },

//     villageName: { type: String },

//     contactNumber: { type: String },

//     email: { type: String },

//     workTypes: { type: [String], default: [] },

//     experience: { type: String },

//     availability: { type: String },

//     address: { type: String },

//     // ✅ NEW FIELDS (added safely)
//     maleRequirement: { type: Number, default: 0 },
//     femaleRequirement: { type: Number, default: 0 },

//     isActive: { type: Boolean, default: true },
//   },
//   {
//     timestamps: true,
//     strict:false,
//     collection: "labour" // ⚠️ VERY IMPORTANT – use existing collection name
//   }
// );

// const Labour: Model<ILabour> =
//   mongoose.models.Labour || mongoose.model<ILabour>("Labour", LabourSchema);

// export default Labour;










import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILabour extends Document {
  name: string;
  villageName: string;
  contactNumber: string;
  email: string;

  workTypes: string[];
  experience: string;
  availability: string;
  address: string;

  maleRequirement: number;
  femaleRequirement: number;

  state:string;
  district:string;
  taluku:string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LabourSchema: Schema<ILabour> = new Schema(
  {
    name: { type: String, required: true },

    villageName: { type: String },

    contactNumber: { type: String },

    email: { type: String },

    workTypes: { type: [String], default: [] },

    experience: { type: String },

    availability: { type: String },

    address: { type: String },

    // ✅ NEW FIELDS (added safely)
    maleRequirement: { type: Number, default: 0 },
    femaleRequirement: { type: Number, default: 0 },
    
    state: { type: String },
    district: { type: String },
    taluku: { type: String },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict:false,
    collection: "labour" // ⚠️ VERY IMPORTANT – use existing collection name
  }
);

const Labour: Model<ILabour> =
  mongoose.models.Labour || mongoose.model<ILabour>("Labour", LabourSchema);

export default Labour;

