import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trackzone';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB] Successfully connected to Database: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Connection to ${mongoURI} failed (${error.message}).`);
    console.log(`ℹ️ [TrackZone] Operating with in-memory persistence layer / local state for rapid testing.`);
    return false;
  }
};
