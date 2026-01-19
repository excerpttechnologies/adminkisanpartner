




// import mongoose, { Schema, Document } from "mongoose";
// import bcrypt from "bcryptjs";

// export interface IAdmin extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: 'admin' | 'subadmin';
//   pageAccess: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(password: string): Promise<boolean>;
// }

// const AdminSchema = new Schema<IAdmin>(
//   {
//     name: { 
//       type: String, 
//       required: true, 
//       trim: true 
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     role: {
//       type: String,
//       enum: ['admin', 'subadmin'],
//       default: 'subadmin',
//       required: true
//     },

//     pageAccess: {
//       type: [String],
//       default: [],
//     },
    
//   },
//   { timestamps: true }
// );

// /* 🔐 HASH PASSWORD (MONGOOSE v7 SAFE) */
// AdminSchema.pre<IAdmin>("save", async function () {
//   if (!this.isModified("password")) return;

//   this.password = await bcrypt.hash(this.password, 10);
// });

// /* 🔐 COMPARE PASSWORD */
// AdminSchema.methods.comparePassword = async function (
//   this: IAdmin,
//   password: string
// ) {
//   return bcrypt.compare(password, this.password);
// };

// export default mongoose.models.Admin ||
//   mongoose.model<IAdmin>("Admin", AdminSchema);




















// import mongoose, { Schema, Document } from "mongoose";
// import bcrypt from "bcryptjs";

// export interface IAdmin extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: 'admin' | 'subadmin';
//   pageAccess: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   isDeleted: boolean;
//   deletedAt:  Date;
//   deletedBy: string;
//     resetToken: string;      // Add this
//   resetTokenExpiry: Date;
//   comparePassword(password: string): Promise<boolean>;
// }

// // Add these to your AdminSchema
// const AdminSchema = new Schema<IAdmin>(
//   {
//     name: { 
//       type: String, 
//       required: true, 
//       trim: true 
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     role: {
//       type: String,
//       enum: ['admin', 'subadmin'],
//       default: 'subadmin',
//       required: true
//     },
//     pageAccess: {
//       type: [String],
//       default: [],
//     },
  
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//     deletedAt: {
//       type: Date,
//       default: null,
//     },
//     deletedBy: {
//       type: String,
//       default: null,
//     },
//       resetToken: String,        // Add this
//   resetTokenExpiry: Date, 
//   },
//   { timestamps: true }
// );

// /* 🔐 HASH PASSWORD (MONGOOSE v7 SAFE) */
// AdminSchema.pre<IAdmin>("save", async function () {
//   if (!this.isModified("password")) return;

//   this.password = await bcrypt.hash(this.password, 10);
// });

// /* 🔐 COMPARE PASSWORD */
// AdminSchema.methods.comparePassword = async function (
//   this: IAdmin,
//   password: string
// ) {
//   return bcrypt.compare(password, this.password);
// };

// export default mongoose.models.Admin ||
//   mongoose.model<IAdmin>("Admin", AdminSchema);










import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'subadmin';
  pageAccess: string[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt:  Date;
  deletedBy: string;
  resetToken: string;      // Add this
  resetTokenExpiry: Date;
  state:string;
  district:string;
  commodity:string[];
  subCategories:string[];
  comparePassword(password: string): Promise<boolean>;
}

// Add these to your AdminSchema
const AdminSchema = new Schema<IAdmin>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'subadmin'],
      default: 'subadmin',
      required: true
    },
    pageAccess: {
      type: [String],
      default: [],
    },
  
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: String,
      default: null,
    },
    state: String,
    district: String,
    commodity: [String],
    subCategories:[String],
    resetToken: String,       
    resetTokenExpiry: Date, 
  },
  { timestamps: true,strict: false }
);

/* 🔐 HASH PASSWORD (MONGOOSE v7 SAFE) */
AdminSchema.pre<IAdmin>("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* 🔐 COMPARE PASSWORD */
AdminSchema.methods.comparePassword = async function (
  this: IAdmin,
  password: string
) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);