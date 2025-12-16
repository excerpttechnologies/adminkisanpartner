import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    cropDetail: {
      cropName: String,
      category: String,
    },

    farmer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    trader: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    status: {
      admin: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      farmer: {
        type: String,
        enum: ["Pending", "Agreed"],
        default: "Pending",
      },
    },

    delivery: {
      date: Date,
      time: String,
    },

    payment: {
      status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
      },
      paymentId: String,
      payDate: Date,
      slip: String,
    },

    bid: {
      price: Number,
      quantity: Number,
    },
  },
  {
    strict:false
    timestamps: true,
  }
);

export default models.orders || model("orders", OrderSchema);
