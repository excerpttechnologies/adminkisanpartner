// models/Tracking.js - SIMPLER: No middleware
import mongoose, { Schema, model, models } from "mongoose";

const stageSchema = new Schema({
  name: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "in_progress", "completed"], 
    default: "pending" 
  },
  photos: [{ type: String }],
  completedAt: { type: Date }
}, { _id: true });

const TrackingSchema = new Schema(
  {
    name: { type: String },
    cropName: { type: String },
    farmerId: { type: String, index: true },
    cropId: { 
      type: Schema.Types.ObjectId, 
      ref: "Crop",
      index: true 
    },
    stages: { type: [stageSchema], default: [] },
    currentStageIndex: { type: Number, default: 0, min: 0 },
    // Remove isCompleted from schema - compute it virtually
  },
  {
    timestamps: true,
    collection: "trackings",
  }
);

// VIRTUAL FIELD: Computed isCompleted
TrackingSchema.virtual('isCompleted').get(function() {
  if (!this.stages || this.stages.length === 0) return false;
  return this.stages.every(stage => stage.status === 'completed');
});

// VIRTUAL FIELD: Progress percentage
TrackingSchema.virtual('progress').get(function() {
  if (!this.stages || this.stages.length === 0) return 0;
  const completed = this.stages.filter(s => s.status === 'completed').length;
  return Math.round((completed / this.stages.length) * 100);
});

// VIRTUAL FIELD: Current stage info
TrackingSchema.virtual('currentStage').get(function() {
  if (!this.stages || this.stages.length === 0) return null;
  return this.stages[this.currentStageIndex];
});

// Enable virtuals in JSON output
TrackingSchema.set('toJSON', { virtuals: true });
TrackingSchema.set('toObject', { virtuals: true });

const Tracking = models.Tracking || model("Tracking", TrackingSchema);
export default Tracking;