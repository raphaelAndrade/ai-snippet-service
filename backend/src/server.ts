import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    console.log(`Server is running on port ${PORT}`);
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
