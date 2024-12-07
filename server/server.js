import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { connectToDatabase } from './db/dbconn.js';
import { PORT } from './config.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { validateUserInput, validateRole } from './middleware/validation.js';
import { requestLogger } from './middleware/logger.js';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Connect to MongoDB
await connectToDatabase();

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'Explorer',
    enum: ['Explorer', 'Navigator', 'Master']
  },
  challenges: {
    navigator: { type: Boolean, default: false },
    master: { type: Boolean, default: false }
  }
});

const User = mongoose.model('User', userSchema);

// Auth Routes
app.post('/api/register', validateUserInput, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { username, role: user.role } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    next(error);
  }
});

app.post('/api/login', validateUserInput, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { username, role: user.role } });
  } catch (error) {
    next(error);
  }
});

// Game Routes
app.put('/api/user/role', authenticateToken, validateRole, async (req, res, next) => {
  try {
    const { newRole } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { role: newRole },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/user', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});


app.use(errorHandler);

const startServer = async (initialPort) => {
    const tryPort = async (port) => {
      try {
        await new Promise((resolve, reject) => {
          const server = app.listen(port)
            .once('listening', () => {
              console.log(`🚀 Server running successfully on port ${port}`);
              resolve(server);
            })
            .once('error', (err) => {
              if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying ${port + 1}...`);
                reject(err);
              } else {
                reject(err);
              }
            });
        });
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          await tryPort(port + 1);
        } else {
          console.error('Error starting server:', err);
          process.exit(1);
        }
      }
    };
  
    await tryPort(initialPort);
  };
  
  // Start the server with initial port from config
  startServer(PORT);