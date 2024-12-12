import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db/dbconn.js';
import { PORT } from './config.js';
import { errorHandler } from './middleware/error.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';

const app = express();

// CORS setup with specific options
const corsOptions = {
  origin: true, // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://access-adventure-exgq.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Apply CORS with options
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
await connectToDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Error handling should be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});