import express from 'express';
import cors from 'cors';
import eventRouter from './src/modules/events/event.routes.js';
import bookingRoutes from './src/modules/bookings/booking.routes.js';
import paymentRoutes from './src/modules/payments/payment.routes.js';
import authRoutes from './src/modules/auth/auth.routes.js';
import categoryRoutes from './src/modules/categories/category.routes.js'; // Added missing import
import { sendOtp } from './src/utils/sendOtp.js';

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'backend is running' });
});

// Dedicated OTP route (or move into authRoutes under /send-otp)
app.post('/api/v1/auth/send-otp', sendOtp);


// API v1 Resource routers
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes); // Standardized to /api/v1/

// 404 handler for undefined routes
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