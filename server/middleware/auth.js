import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get fresh user data from database
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user's current role is in allowed roles
      if (!allowedRoles.includes(user.role)) {
        console.log('Access denied. User role:', user.role, 'Required roles:', allowedRoles);
        return res.status(403).json({ 
          error: `Access denied. Required role: ${allowedRoles.join(' or ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

// Validate role progression
export const validateRoleProgression = async (req, res, next) => {
  try {
    const { newRole } = req.body;
    const currentRole = req.user.role;
    
    const roleHierarchy = {
      'Explorer': ['Navigator'],
      'Navigator': ['Master'],
      'Master': []
    };

    // Check if the requested role is a valid progression
    if (!roleHierarchy[currentRole].includes(newRole)) {
      return res.status(403).json({ 
        error: `Invalid role progression. From ${currentRole} you can only progress to: ${roleHierarchy[currentRole].join(', ')}`
      });
    }

    // Check if user has completed required challenges
    const user = await User.findById(req.user.userId);
    
    if (newRole === 'Navigator' && !user.challenges.navigator) {
      return res.status(403).json({ 
        error: 'Must complete Navigator challenge first' 
      });
    }
    
    if (newRole === 'Master' && !user.challenges.master) {
      return res.status(403).json({ 
        error: 'Must complete Master challenge first' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Rate limiting middleware
export const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

// Token blacklist (for logout)
const tokenBlacklist = new Set();

export const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
};

export const checkBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }
  
  next();
};
