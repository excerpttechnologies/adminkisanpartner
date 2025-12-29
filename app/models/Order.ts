// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface IOrder extends Document {}

// const OrderSchema = new Schema({}, {
//   timestamps: true,
//   strict: false,          // ✅ accept any structure
//   collection: "orders",   // ✅ existing collection
// });

// const Order: Model<IOrder> =
//   mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

// export default Order;



/* eslint-disable @typescript-eslint/no-empty-object-type */
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {},
  {
    timestamps: true,
    strict: false,        // allow any fields
    collection: "orders", // existing collection
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;