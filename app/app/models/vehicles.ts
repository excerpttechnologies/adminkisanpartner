import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true 
  },
  pricePerKm: { 
    type: Number, 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);