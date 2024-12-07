import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, MONGO_DB_NAME } = process.env;

if (!MONGO_URI || !MONGO_DB_NAME) {
  console.error('Missing required environment variables: MONGO_URI or MONGO_DB_NAME');
  process.exit(1);
}

export async function connectToDatabase() {
  try {
    const connectionString = `${MONGO_URI}/${MONGO_DB_NAME}`;
    console.log('Attempting to connect to MongoDB...');
    console.log(`Database: ${MONGO_DB_NAME}`);
    
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully! 🎉');
    
    // Set up connection error handler
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Set up disconnection handler
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}