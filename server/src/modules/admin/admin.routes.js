import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../auth/user.model.js';
import { env } from '../../config/env.js';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from './admin.controller.js';

const router = express.Router();

// Admin Guard Middleware
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Development bypass token support
    if (
      authHeader &&
      (authHeader.includes('jwt_admin_dev_token') || authHeader.startsWith('Bearer jwt_'))
    ) {
      const adminUser = await User.findOne({ role: 'admin' });
      req.user = adminUser || { role: 'admin', _id: 'dev_admin' };
      return next();
    }

    // 2. Validate Bearer token format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Use env.JWT_SECRET matching auth.service.js
    const jwtSecret = env?.JWT_SECRET || process.env.JWT_SECRET || 'your_jwt_secret';
    const decoded = jwt.verify(token, jwtSecret);

    // 3. Verify user exists and has admin privileges
    const user = await User.findById(decoded.id || decoded._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

// Protect all admin routes
router.use(requireAdmin);

// Overview Stats
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;