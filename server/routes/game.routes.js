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
      
      // Get current user data
      const currentUser = await User.findById(req.user.userId);
      console.log('Current user state:', { 
        username: currentUser.username, 
        currentRole: currentUser.role,
        newRole 
      });
  
      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        { role: newRole },
        { new: true }
      ).select('-password'); // Exclude password from response
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Generate new token with updated role
      const newToken = jwt.sign(
        { 
          userId: updatedUser._id, 
          username: updatedUser.username,
          role: newRole
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      console.log('Role update successful:', { 
        username: updatedUser.username, 
        oldRole: currentUser.role,
        newRole: updatedUser.role 
      });
  
      res.json({
        token: newToken,
        user: {
          username: updatedUser.username,
          role: updatedUser.role
        }
      });
  
    } catch (error) {
      console.error('Role update error:', error);
      res.status(500).json({ error: 'Error updating role' });
    }
});

// Role-specific content routes
router.get('/explorer-content', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log('Accessing explorer content:', { username: user.username, role: user.role });
    res.json({ content: 'Welcome Explorer! Begin your journey through geography.' });
  } catch (error) {
    console.error('Error accessing explorer content:', error);
    res.status(500).json({ error: 'Error accessing content' });
  }
});

router.get('/navigator-content', authenticateToken, authorize(['Navigator', 'Master']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log('Accessing navigator content:', { username: user.username, role: user.role });
    res.json({ content: 'Welcome Navigator! Ready to chart new territories?' });
  } catch (error) {
    console.error('Error accessing navigator content:', error);
    res.status(500).json({ error: 'Error accessing content' });
  }
});

router.get('/master-content', authenticateToken, authorize(['Master']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log('Accessing master content:', { username: user.username, role: user.role });
    res.json({ content: 'Welcome Master! Your geography expertise is unmatched.' });
  } catch (error) {
    console.error('Error accessing master content:', error);
    res.status(500).json({ error: 'Error accessing content' });
  }
});

export default router;