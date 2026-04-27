// import mongoose, { Schema, Document, Model } from 'mongoose';

// export interface IUserDocument extends Document {
//   _id: string;
//   mobileNumber: string;
//   businessName: string;
//   businessType: string;
//   gstNumber?: string;
//   name: string;
//   email?: string;
//   address?: string;
//   state?: string;
//   district?: string;
//   taluk?: string;
//   village?: string;
//   security: {
//     password: string;
//     mpin: string;
//     otp: string;
//     otpExpiry: Date | null;
//   };
//   role: string;
//   isActive: boolean;
//   // Verification fields (added by admin)
//   verificationStatus?: 'pending' | 'verified' | 'rejected';
//   rejectionReason?: string;
//   verifiedBy?: string;
//   verifiedDate?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<IUserDocument>(
//   {
//     mobileNumber:     { type: String, required: true, unique: true },
//     businessName:     { type: String, default: '' },
//     businessType:     { type: String, default: '' },
//     gstNumber:        { type: String, default: '' },
//     name:             { type: String, default: '' },
//     email:            { type: String, default: '' },
//     address:          { type: String, default: '' },
//     state:            { type: String, default: '' },
//     district:         { type: String, default: '' },
//     taluk:            { type: String, default: '' },
//     village:          { type: String, default: '' },
//     security: {
//       password:  { type: String, default: '' },
//       mpin:      { type: String, default: '' },
//       otp:       { type: String, default: '' },
//       otpExpiry: { type: Date, default: null },
//     },
//     role:               { type: String, default: 'b2b_buyer' },
//     isActive:           { type: Boolean, default: true },
//     verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
//     rejectionReason:    { type: String, default: '' },
//     verifiedBy:         { type: String, default: '' },
//     verifiedDate:       { type: String, default: '' },
//   },
//   { timestamps: true }
// );

// // Prevent model re-compilation in dev (Next.js hot reload)
// const User: Model<IUserDocument> =
//   mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

// export default User;










import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId;  // ✅ fixed — was 'string', must be ObjectId
  mobileNumber: string;
  businessName: string;
  businessType: string;
  gstNumber?: string;
  name: string;
  email?: string;
  address?: string;
  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  security: {
    password: string;
    mpin: string;
    otp: string;
    otpExpiry: Date | null;
  };
  role: string;
  isActive: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    mobileNumber:     { type: String, required: true, unique: true },
    businessName:     { type: String, default: '' },
    businessType:     { type: String, default: '' },
    gstNumber:        { type: String, default: '' },
    name:             { type: String, default: '' },
    email:            { type: String, default: '' },
    address:          { type: String, default: '' },
    state:            { type: String, default: '' },
    district:         { type: String, default: '' },
    taluk:            { type: String, default: '' },
    village:          { type: String, default: '' },
    security: {
      password:  { type: String, default: '' },
      mpin:      { type: String, default: '' },
      otp:       { type: String, default: '' },
      otpExpiry: { type: Date, default: null },
    },
    role:               { type: String, default: 'b2b_buyer' },
    isActive:           { type: Boolean, default: true },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    rejectionReason:    { type: String, default: '' },
    verifiedBy:         { type: String, default: '' },
    verifiedDate:       { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'b2busers',
  }
);

// Prevent model re-compilation in dev (Next.js hot reload)
const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;