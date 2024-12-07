import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectToDatabase() {
  try {
    const { MONGO_URI, MONGO_DB_NAME } = process.env;

    if (!MONGO_URI || !MONGO_DB_NAME) {
      throw new Error('Missing MongoDB environment variables');
    }

    // Remove any trailing slashes from MONGO_URI
    const cleanUri = MONGO_URI.replace(/\/$/, '');
    
    console.log('Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(cleanUri, {
      dbName: MONGO_DB_NAME, // Use dbName option instead of appending to URI
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log('Successfully connected to MongoDB Atlas!');
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to database:', MONGO_DB_NAME);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}