// import mongoose from 'mongoose';

// const BreedSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Prevent model recompilation in development
// export default mongoose.models.Breed || mongoose.model('Breed', BreedSchema);


import mongoose from 'mongoose';

const BreedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
 sortOrder: {
      type: Number,
      default: 0,
      min: [0, 'Sort order must be at least 0']
    },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent model recompilation in development
export default mongoose.models.Breed || mongoose.model('Breed', BreedSchema);