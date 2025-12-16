import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    personalInfo: {
      name: { type: String, required: true },
      mobileNo: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String },
      villageGramaPanchayat: { type: String },
      pincode: { type: String },
      state: { type: String },
      district: { type: String },
      taluk: { type: String },
      post: { type: String },
      location: { type: String }, // "lat,lng"
      role: { type: String, enum: ["farmer", "agent", "transport", "admin"] },
    },

    commodities: [
      {
        type: String,
      },
    ],

    transportInfo: {
      vehicleType: { type: String },

      vehicleCapacity: {
        type: String,
      },

      vehicleNumber: {
        type: String,
      },

      isCompany: {
        type: Boolean,
        default: false,
      },
    },

    driverInfo: {
      name: { type: String },
      mobileNo: { type: String },
      licenseNumber: { type: String },
    },

    bankDetails: {
      accountHolderName: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      upiId: { type: String },
    },

    documents: {
      rcBook: { type: String },
      insuranceDoc: { type: String },
      pollutionCert: { type: String },
      permitDoc: { type: String },
      driverLicense: { type: String },
    },

    security: {
      referralCode: { type: String },
      mpin: { type: String },
      password: { type: String },
      isActive: { type: Boolean, default: true },
    },

    nearestMarkets: [
      {
        type: String,
    //   },
    // ],

    // registeredAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    collection: "users", 
    timestamps: false,
  }
);

export default models.User || model("User", UserSchema);
