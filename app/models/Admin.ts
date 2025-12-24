import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  pageAccess: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },

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

    pageAccess: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
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
