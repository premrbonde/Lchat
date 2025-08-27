import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Adjust path to root .env if needed, but for now assuming it's in backend

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('MONGO_URI is not defined in the environment variables.');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('An unknown error occurred during DB connection');
    }
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
