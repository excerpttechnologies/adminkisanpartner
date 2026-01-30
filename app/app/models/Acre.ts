import mongoose from 'mongoose';

const AcreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an acre name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Acre name cannot be more than 100 characters']
  }
}, {
  timestamps: true
});

// Prevent model recompilation in development
//delete mongoose.connection.models['Acre'];

export default mongoose.models.Acre || mongoose.model('Acre', AcreSchema);