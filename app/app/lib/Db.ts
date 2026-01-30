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


// import mongoose from 'mongoose';

// const MONGODB_URI = 'mongodb+srv://root:1234@cluster0.ofeco44.mongodb.net/KissanPartner';

// interface MongooseCache {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// }

// declare global {
//   var mongoose: MongooseCache | undefined;
// }

// let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// if (!global.mongoose) {
//   global.mongoose = cached;
// }

// export async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       maxPoolSize: 10,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log('✅ MongoDB Connected Successfully');
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (error) {
//     cached.promise = null;
//     console.error('❌ MongoDB Connection Error:', error);
//     throw error;
//   }

//   return cached.conn;
// }

// export default {connectDB};