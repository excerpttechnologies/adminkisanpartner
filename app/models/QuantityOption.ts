import mongoose from 'mongoose';

const QuantityOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a quantity option name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Quantity option name cannot be more than 100 characters']
  },
  sort: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent model recompilation in development
///delete mongoose.connection.models['QuantityOption'];

export default mongoose.models.QuantityOption || mongoose.model('QuantityOption', QuantityOptionSchema);