export const validateUserInput = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    next();
  };
  
  export const validateRole = (req, res, next) => {
    const { newRole } = req.body;
    
    if (!newRole) {
      return res.status(400).json({ error: 'New role is required' });
    }
  
    if (!['Explorer', 'Navigator', 'Master'].includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
  
    next();
  };