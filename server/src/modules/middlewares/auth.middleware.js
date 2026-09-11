import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

// Verify JWT and attach decoded user payload to request
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Authorization denied.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Check if authenticated user has admin role
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Adjust 'role' if your JWT payload uses a different key (e.g., req.user.isAdmin)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }

  next();
};

// Export alias so imports using `verifyToken` also work
export const verifyToken = authenticate;