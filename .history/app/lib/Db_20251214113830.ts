import mongoose from 'mongoose'

const connectDB = async () => {
  try {
  
    const conn = await mongoose.connect(`mongodb+srv://root:1234@cluster0.ofeco44.mongodb.net/KissanPartner`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;