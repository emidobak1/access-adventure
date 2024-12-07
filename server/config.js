import 'dotenv/config';

export const PORT = parseInt(process.env.PORT || '5000', 10);
export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
export const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || '3000', 10);

// Verify environment variables
if (!MONGO_URI || !MONGO_DB_NAME) {
  console.error('Environment variables are missing! Please check your .env file.');
  process.exit(1);
}