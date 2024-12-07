import mongoose from 'mongoose';

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

export default mongoose.model('User', userSchema);