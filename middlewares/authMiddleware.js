const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded token info to request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;


/*const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;*/
