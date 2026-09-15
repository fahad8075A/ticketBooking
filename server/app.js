import express from 'express';
import cors from 'cors';
import eventRouter from './src/modules/events/event.routes.js';
import bookingRoutes from './src/modules/bookings/booking.routes.js';
import paymentRoutes from './src/modules/payments/payment.routes.js';
import authRoutes from './src/modules/auth/auth.routes.js';
import categoryRoutes from './src/modules/categories/category.routes.js';
import adminRoutes from './src/modules/admin/admin.routes.js';
import { sendOtp } from './src/utils/sendOtp.js';
import { verifyOtp } from './src/modules/auth/auth.controller.js';

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'backend is running' });
});

// Dedicated OTP endpoints (accepts /api/v1/auth and direct /auth)
app.post('/api/v1/auth/send-otp', sendOtp);
app.post('/auth/send-otp', sendOtp);

app.post('/api/v1/auth/verify-otp', verifyOtp);
app.post('/auth/verify-otp', verifyOtp);

// API Resource routers (versioned)
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/categories', categoryRoutes);

// API Resource routers (shorthand paths)
app.use('/events', eventRouter);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/categories', categoryRoutes);

// Admin routes (versioned and shorthand)
app.use('/api/v1/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Auth router (versioned and shorthand)
app.use('/api/v1/auth', authRoutes);
app.use('/auth', authRoutes);

// 404 handler for undefined routes (MUST stay below all routes)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global 500 error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;