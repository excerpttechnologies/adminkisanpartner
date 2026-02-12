// import mongoose, { Schema, Document, Model } from 'mongoose';

// export interface IStatesDetails extends Document {
//   pinCode: string;
//   state: string;
//   district: string;
//   taluk: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const StatesDetailsSchema: Schema<IStatesDetails> = new Schema({
//   pinCode: {
//     type: String,
//     required: [true, 'PIN Code is required'],
//     unique: true,
//     trim: true,
//     minlength: 6,
//     maxlength: 6
//   },
//   state: {
//     type: String,
//     required: [true, 'State is required'],
//     trim: true
//   },
//   district: {
//     type: String,
//     required: [true, 'District is required'],
//     trim: true
//   },
//   taluk: {
//     type: String,
//     required: [true, 'Taluk is required'],
//     trim: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Using async/await to avoid next() parameter issue
// StatesDetailsSchema.pre('save', async function() {
//   this.updatedAt = new Date();
// });

// // For update operations
// StatesDetailsSchema.pre('findOneAndUpdate', async function() {
//   this.set({ updatedAt: new Date() });
// });

// const StatesDetails: Model<IStatesDetails> = 
//   mongoose.models.StatesDetails || mongoose.model<IStatesDetails>('StatesDetails', StatesDetailsSchema);

// export default StatesDetails;

















import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStatesDetails extends Document {
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatesDetailsSchema: Schema<IStatesDetails> = new Schema({
  pinCode: {
    type: String,
    trim: true,
    minlength: 6,
    maxlength: 6
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  taluk: {
    type: String,
    required: [true, 'Taluk is required'],
    trim: true
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

// Using async/await to avoid next() parameter issue
StatesDetailsSchema.pre('save', async function() {
  this.updatedAt = new Date();
});

// For update operations
StatesDetailsSchema.pre('findOneAndUpdate', async function() {
  this.set({ updatedAt: new Date() });
});

const StatesDetails: Model<IStatesDetails> = 
  mongoose.models.StatesDetails || mongoose.model<IStatesDetails>('StatesDetails', StatesDetailsSchema);

export default StatesDetails;

