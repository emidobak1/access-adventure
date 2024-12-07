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
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
      }

      req.user = decoded; // Store decoded user info
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Role-based access control middleware
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'No role specified' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
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
