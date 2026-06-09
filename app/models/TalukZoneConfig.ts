







import mongoose, { Schema, model, models } from "mongoose";

const ZoneSchema = new Schema(
  { min: Number, max: Number, color: String },
  { _id: false }
);

const CommodityRangeSchema = new Schema(
  {
    commodity: String,
    enabled:   Boolean,
    ranges: {
      green:  ZoneSchema,
      yellow: ZoneSchema,
      red:    ZoneSchema,
    },
  },
  { _id: false }
);

// level: "state" | "district" | "taluk"
// - state level    → state is set, district & taluk are empty
// - district level → state + district are set, taluk is empty
// - taluk level    → state + district + taluk are set  (backward compat: old docs have only taluk)
const TalukZoneConfigSchema = new Schema(
  {
    level:    { type: String, enum: ["state", "district", "taluk"], default: "taluk" },
    state:    { type: String, default: "" },
    district: { type: String, default: "" },
    taluk:    { type: String, default: "" },   // kept for backward compatibility
    commodityRanges: [CommodityRangeSchema],
  },
  { timestamps: true }
);

// Unique per level+state+district+taluk combination
TalukZoneConfigSchema.index(
  { level: 1, state: 1, district: 1, taluk: 1 },
  { unique: true }
);

export default models.TalukZoneConfig ||
  model("TalukZoneConfig", TalukZoneConfigSchema);