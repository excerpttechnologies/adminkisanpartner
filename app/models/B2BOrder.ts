// // models/B2BOrder.js
// const mongoose = require("mongoose");

// const b2bOrderItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "B2BProduct",
//     required: true,
//   },
//   productName: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true, min: 1 },
//   unit: { type: String, default: "kg" },
//   image: { type: String, default: "" },
//   categoryName: { type: String, default: "" },
//   subtotal: { type: Number, required: true },
// });

// const paymentDetailsSchema = new mongoose.Schema({
//   razorpayOrderId: { type: String },
//   razorpayPaymentId: { type: String },
//   razorpaySignature: { type: String },
//   amount: { type: Number },
//   currency: { type: String, default: "INR" },
//   status: {
//     type: String,
//     enum: ["pending", "success", "failed"],
//     default: "pending",
//   },
//   paymentMethod: { type: String, default: "razorpay" },
//   paidAt: { type: Date },
// });

// const b2bOrderSchema = new mongoose.Schema(
//   {
//     orderId: { type: String, unique: true, required: true }, // Human readable order ID
//     b2bUserId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "B2BUser",
//       required: true,
//     },
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "B2BAddress",
//       required: true,
//     },
//     addressSnapshot: {
//       fullName: String,
//       phoneNumber: String,
//       addressLine1: String,
//       addressLine2: String,
//       landmark: String,
//       city: String,
//       state: String,
//       pincode: String,
//       country: String,
//     },
//     items: [b2bOrderItemSchema],
//     subtotal: { type: Number, required: true },
//     tax: { type: Number, default: 0 },
//     shippingCharge: { type: Number, default: 0 },
//     discount: { type: Number, default: 0 },
//     totalAmount: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "confirmed",
//         "processing",
//         "shipped",
//         "out_for_delivery",
//         "delivered",
//         "cancelled",
//         "refunded",
//       ],
//       default: "pending",
//     },
//     statusHistory: [
//       {
//         status: { type: String },
//         note: { type: String },
//         updatedBy: { type: String },
//         timestamp: { type: Date, default: Date.now },
//       },
//     ],
//     paymentDetails: paymentDetailsSchema,
//     trackingDetails: {
//       courierName: { type: String },
//       trackingNumber: { type: String },
//       trackingUrl: { type: String },
//       estimatedDelivery: { type: Date },
//     },
//     cancellationReason: { type: String },
//     notes: { type: String },
//   },
//   {
//     timestamps: true,
//     collection: "b2borders",
//   },
// );

// // Generate order ID before saving
// b2bOrderSchema.pre("save", async function () {
//   if (!this.orderId) {
//     const date = new Date();
//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const random = Math.floor(Math.random() * 10000)
//       .toString()
//       .padStart(4, "0");

//     this.orderId = `B2B${year}${month}${random}`;
//   }
// });

// // Add status change to history
// b2bOrderSchema.methods.updateStatus = async function (
//   newStatus,
//   note = "",
//   updatedBy = "system",
// ) {
//   this.statusHistory.push({
//     status: newStatus,
//     note: note,
//     updatedBy: updatedBy,
//     timestamp: new Date(),
//   });
//   this.status = newStatus;
//   await this.save();
// };

// b2bOrderSchema.index({ b2bUserId: 1 });
// b2bOrderSchema.index({ orderId: 1 });
// b2bOrderSchema.index({ status: 1 });
// b2bOrderSchema.index({ createdAt: -1 });

// module.exports = mongoose.model("B2BOrder", b2bOrderSchema);












import mongoose, { Schema, Document, Model } from "mongoose";

/* =========================
   ORDER ITEM TYPE
========================= */
export interface IB2BOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  price: number;
  quantity: number;
  unit?: string;
  image?: string;
  categoryName?: string;
  subtotal: number;
}

/* =========================
   PAYMENT TYPE
========================= */
export interface IPaymentDetails {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount?: number;
  currency?: string;
  status?: "pending" | "success" | "failed";
  paymentMethod?: string;
  paidAt?: Date;
}

/* =========================
   MAIN ORDER TYPE
========================= */
export interface IB2BOrder extends Document {
  orderId: string;
  b2bUserId: mongoose.Types.ObjectId;
  address: mongoose.Types.ObjectId;

  addressSnapshot?: {
    fullName?: string;
    phoneNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  items: IB2BOrderItem[];

  subtotal: number;
  tax?: number;
  shippingCharge?: number;
  discount?: number;
  totalAmount: number;

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "refunded";

  statusHistory: {
    status: string;
    note?: string;
    updatedBy?: string;
    timestamp: Date;
  }[];

  paymentDetails?: IPaymentDetails;

  trackingDetails?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
  };

  cancellationReason?: string;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;

  updateStatus(
    newStatus: IB2BOrder["status"],
    note?: string,
    updatedBy?: string
  ): Promise<void>;
}

/* =========================
   SCHEMAS
========================= */

const OrderItemSchema = new Schema<IB2BOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "B2BProduct",
    required: true,
  },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: "kg" },
  image: { type: String, default: "" },
  categoryName: { type: String, default: "" },
  subtotal: { type: Number, required: true },
});

const PaymentSchema = new Schema<IPaymentDetails>({
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String, default: "razorpay" },
  paidAt: Date,
});

/* =========================
   MAIN SCHEMA
========================= */

const B2BOrderSchema = new Schema<IB2BOrder>(
  {
    orderId: { type: String, unique: true, required: true },

    b2bUserId: {
      type: Schema.Types.ObjectId,
      ref: "b2busers",
      required: true,
    },

    address: {
      type: Schema.Types.ObjectId,
      ref: "B2BAddress",
      required: true,
    },

    addressSnapshot: {
      fullName: String,
      phoneNumber: String,
      addressLine1: String,
      addressLine2: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    items: [OrderItemSchema],

    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    statusHistory: [
      {
        status: String,
        note: String,
        updatedBy: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    paymentDetails: PaymentSchema,

    trackingDetails: {
      courierName: String,
      trackingNumber: String,
      trackingUrl: String,
      estimatedDelivery: Date,
    },

    cancellationReason: String,
    notes: String,
  },
  {
    timestamps: true,
    collection: "b2borders",
  }
);

/* =========================
   PRE SAVE HOOK (FIXED)
========================= */


/* =========================
   INDEXES
========================= */

B2BOrderSchema.index({ b2bUserId: 1 });
B2BOrderSchema.index({ orderId: 1 });
B2BOrderSchema.index({ status: 1 });
B2BOrderSchema.index({ createdAt: -1 });

/* =========================
   EXPORT (VERY IMPORTANT)
========================= */

const B2BOrder: Model<IB2BOrder> =
  mongoose.models.B2BOrder ||
  mongoose.model<IB2BOrder>("B2BOrder", B2BOrderSchema);

export default B2BOrder;