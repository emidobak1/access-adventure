import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { validateRole } from '../middleware/validation.js';

const router = express.Router();

// Verify token route
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      username: user.username,
      role: user.role,
      userId: user._id
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user role
router.put('/user/role', authenticateToken, validateRole, async (req, res) => {
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
    console.error('Role update error:', error);
    res.status(500).json({ error: 'Error updating role' });
  }
});

// Role-specific content routes
router.get('/explorer-content', authenticateToken, (req, res) => {
  res.json({ content: 'Welcome Explorer! Begin your journey through geography.' });
});

router.get('/navigator-content', authenticateToken, authorize(['Navigator', 'Master']), (req, res) => {
  res.json({ content: 'Welcome Navigator! Ready to chart new territories?' });
});

router.get('/master-content', authenticateToken, authorize(['Master']), (req, res) => {
  res.json({ content: 'Welcome Master! Your geography expertise is unmatched.' });
});

export default router;