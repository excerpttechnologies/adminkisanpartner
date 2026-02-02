import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default:null
    //  required: true,
    },
actorRole: {
  type: String,
  enum: ["admin", "subadmin"],
  // required: true,
},


    action: {
      type: String,
     // required: true,
     
    },

    module: {
      type: String,
      // required: true,
    
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    description: {
      type: String,
      // required: true,
    },changes: {
  type: Object,
  default: {},
},


    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);


