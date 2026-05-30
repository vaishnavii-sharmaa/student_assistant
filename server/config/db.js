import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-assistant';

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`MongoDB connection error: ${error.message}`);
      process.exit(1);
    }

    console.warn(`Local MongoDB unavailable (${error.message}).`);
    console.warn('Starting in-memory database for development...');

    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('MongoDB connected (in-memory dev database)');
  }
};

export default connectDB;
