import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMandi extends Document {
  mandiId: string;
  mandiName: string;
  state: string;
  district: string;
  taluka: string;
  address: string;
  pincode: string;
  isActive: boolean;
  // subAdmins assigned to this mandi (references Admin._id)
  subAdmins: mongoose.Types.ObjectId[];
  // Permission flag: if true, subadmins of this mandi can view crop postings
  allowPostingView: boolean;
  // Permission flag: if true, subadmins can see farmer mobile numbers
  allowMobileView: boolean;
  createdBy: string; // admin _id who created
  createdAt: Date;
  updatedAt: Date;
}

const MandiSchema: Schema<IMandi> = new Schema(
  {
    mandiId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mandiName: {
      type: String,
      required: [true, "Mandi name is required"],
      trim: true,
      maxlength: [100, "Mandi name cannot exceed 100 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    taluka: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    pincode: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subAdmins: [
      {
        type: Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
    // Master permission toggle: admin controls whether subadmins can see postings
    allowPostingView: {
      type: Boolean,
      default: false,
    },
    // Master permission toggle: admin controls whether subadmins can see farmer mobile numbers
    allowMobileView: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "mandis",
  }
);

// Indexes
MandiSchema.index({ state: 1, district: 1 });
MandiSchema.index({ isActive: 1 });
MandiSchema.index({ subAdmins: 1 });
MandiSchema.index({ mandiName: "text", district: "text", state: "text" });

const Mandi: Model<IMandi> =
  mongoose.models.Mandi || mongoose.model<IMandi>("Mandi", MandiSchema);

export default Mandi;