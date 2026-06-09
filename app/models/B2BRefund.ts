// import mongoose, { Schema, Document, Model } from "mongoose";

// // ==================== INTERFACES ====================

// export interface IRefundItem {
//   productId: mongoose.Types.ObjectId;
//   productName: string;
//   quantity: number;
//   price: number;
//   subtotal: number;
//   reason: string;
// }

// export interface IB2BRefund extends Document {
//   refundId: string;
//   orderId: mongoose.Types.ObjectId;
//   b2bUserId: mongoose.Types.ObjectId;
  
//   // Payment details
//   razorpayPaymentId: string;
//   razorpayRefundId?: string;
  
//   // Staff/Admin details
//   approvedBy: string;
//   processedBy: string;
//   staffRemarks: string;
  
//   // Refund details
//   amount: number;
//   refundAmount: number;
//   reason: string;
//   description?: string;
//   refundType: "full" | "partial";
  
//   // Refund items
//   items: IRefundItem[];
  
//   // Status
//   status: "requested" | "approved" | "processing" | "completed" | "rejected" | "cancelled" | "failed";
  
//   // Transaction details
//   transactionId?: string;
//   refundMode: "razorpay" | "bank_transfer" | "wallet" | "manual";
  
//   // Timestamps
//   requestedAt: Date;
//   approvedAt?: Date;
//   processedAt?: Date;
//   completedAt?: Date;
  
//   // Remarks
//   userRemarks?: string;
//   adminRemarks?: string;
  
//   // Error tracking
//   errorMessage?: string;
//   retryCount: number;
  
//   // Metadata
//   metadata?: any;
  
//   // Mongoose timestamps
//   createdAt: Date;
//   updatedAt: Date;
// }

// // ==================== SCHEMA ====================

// const RefundItemSchema = new Schema<IRefundItem>({
//   productId: { type: Schema.Types.ObjectId, ref: "B2BProduct", required: true },
//   productName: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true },
//   subtotal: { type: Number, required: true },
//   reason: { type: String, required: true },
// });

// const RefundSchema = new Schema<IB2BRefund>(
//   {
//     refundId: { type: String, unique: true, required: true },
//     orderId: {
//       type: Schema.Types.ObjectId,
//       ref: "B2BOrder",
//       required: true,
//     },
//     b2bUserId: {
//       type: Schema.Types.ObjectId,
//       ref: "B2BUser",
//       required: true,
//     },

//     // Payment details
//     razorpayPaymentId: { type: String, required: true },
//     razorpayRefundId: { type: String },

//     // Staff/Admin details
//     approvedBy: { type: String, default: "" },
//     processedBy: { type: String, default: "" },
//     staffRemarks: { type: String, default: "" },

//     // Refund details
//     amount: { type: Number, required: true },
//     refundAmount: { type: Number, required: true },
//     reason: { type: String, required: true },
//     description: { type: String },
//     refundType: { type: String, enum: ["full", "partial"], default: "full" },

//     // Refund items
//     items: [RefundItemSchema],

//     // Status
//     status: {
//       type: String,
//       enum: [
//         "requested",
//         "approved",
//         "processing",
//         "completed",
//         "rejected",
//         "cancelled",
//         "failed",
//       ],
//       default: "requested",
//     },

//     // Transaction details
//     transactionId: { type: String },
//     refundMode: {
//       type: String,
//       enum: ["razorpay", "bank_transfer", "wallet", "manual"],
//       default: "razorpay",
//     },

//     // Timestamps
//     requestedAt: { type: Date, default: Date.now },
//     approvedAt: { type: Date },
//     processedAt: { type: Date },
//     completedAt: { type: Date },

//     // Remarks
//     userRemarks: { type: String },
//     adminRemarks: { type: String },

//     // Error tracking
//     errorMessage: { type: String },
//     retryCount: { type: Number, default: 0 },

//     // Metadata
//     metadata: { type: Schema.Types.Mixed },
//   },
//   { timestamps: true },
// );

// // ==================== INDEXES ====================
// RefundSchema.index({ refundId: 1 });
// RefundSchema.index({ orderId: 1 });
// RefundSchema.index({ b2bUserId: 1 });
// RefundSchema.index({ status: 1 });
// RefundSchema.index({ createdAt: -1 });

// // ==================== PRE-SAVE MIDDLEWARE ====================
// RefundSchema.pre("save", async function (this: IB2BRefund) {
//   if (!this.refundId) {
//     const date = new Date();
//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const random = Math.floor(Math.random() * 10000)
//       .toString()
//       .padStart(4, "0");
//     this.refundId = `REF${year}${month}${random}`;
//   }
//   next();
// });

// // ==================== EXPORT MODEL ====================
// const B2BRefund: Model<IB2BRefund> =
//   mongoose.models.B2BRefund || mongoose.model<IB2BRefund>("B2BRefund", RefundSchema);

// export default B2BRefund;















//updated by sagar




import mongoose, { Schema, Document, Model } from "mongoose";

// ==================== INTERFACES ====================

export interface IRefundItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  reason: string;
}

export interface IB2BRefund extends Document {
  refundId: string;
  orderId: mongoose.Types.ObjectId;
  b2bUserId: mongoose.Types.ObjectId;
  
  // Payment details
  razorpayPaymentId: string;
  razorpayRefundId?: string;
  
  // Staff/Admin details
  approvedBy: string;
  processedBy: string;
  staffRemarks: string;
  
  // Refund details
  amount: number;
  refundAmount: number;
  reason: string;
  description?: string;
  refundType: "full" | "partial";
  
  // Refund items
  items: IRefundItem[];
  
  // Status
  status: "requested" | "approved" | "processing" | "completed" | "rejected" | "cancelled" | "failed";
  
  // Transaction details
  transactionId?: string;
  refundMode: "razorpay" | "bank_transfer" | "wallet" | "manual";
  
  // Timestamps
  requestedAt: Date;
  approvedAt?: Date;
  processedAt?: Date;
  completedAt?: Date;
  
  // Remarks
  userRemarks?: string;
  adminRemarks?: string;
  
  // Error tracking
  errorMessage?: string;
  retryCount: number;
  
  // Metadata
  metadata?: any;
  
  // Mongoose timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SCHEMA ====================

const RefundItemSchema = new Schema<IRefundItem>({
  productId: { type: Schema.Types.ObjectId, ref: "B2BProduct", required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  reason: { type: String, required: true },
});

const RefundSchema = new Schema<IB2BRefund>(
  {
    refundId: { type: String, unique: true, required: true },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "B2BOrder",
      required: true,
    },
    b2bUserId: {
      type: Schema.Types.ObjectId,
      ref: "B2BUser",
      required: true,
    },

    // Payment details
    razorpayPaymentId: { type: String, required: true },
    razorpayRefundId: { type: String },

    // Staff/Admin details
    approvedBy: { type: String, default: "" },
    processedBy: { type: String, default: "" },
    staffRemarks: { type: String, default: "" },

    // Refund details
    amount: { type: Number, required: true },
    refundAmount: { type: Number, required: true },
    reason: { type: String, required: true },
    description: { type: String },
    refundType: { type: String, enum: ["full", "partial"], default: "full" },

    // Refund items
    items: [RefundItemSchema],

    // Status
    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "processing",
        "completed",
        "rejected",
        "cancelled",
        "failed",
      ],
      default: "requested",
    },

    // Transaction details
    transactionId: { type: String },
    refundMode: {
      type: String,
      enum: ["razorpay", "bank_transfer", "wallet", "manual"],
      default: "razorpay",
    },

    // Timestamps
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    processedAt: { type: Date },
    completedAt: { type: Date },

    // Remarks
    userRemarks: { type: String },
    adminRemarks: { type: String },

    // Error tracking
    errorMessage: { type: String },
    retryCount: { type: Number, default: 0 },

    // Metadata
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// ==================== INDEXES ====================
RefundSchema.index({ refundId: 1 });
RefundSchema.index({ orderId: 1 });
RefundSchema.index({ b2bUserId: 1 });
RefundSchema.index({ status: 1 });
RefundSchema.index({ createdAt: -1 });

// ==================== PRE-SAVE MIDDLEWARE ====================
RefundSchema.pre("save", async function (this: IB2BRefund) {
  if (!this.refundId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.refundId = `REF${year}${month}${random}`;
  }

});

// ==================== EXPORT MODEL ====================
const B2BRefund: Model<IB2BRefund> =
  mongoose.models.B2BRefund || mongoose.model<IB2BRefund>("B2BRefund", RefundSchema);

export default B2BRefund;