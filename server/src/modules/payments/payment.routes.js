import express from 'express';
import {
  initializePayment,
  confirmPayment,
  getPaymentStatus,
} from './payment.controller.js';

const router = express.Router();

router.post('/create-intent', initializePayment);
router.post('/verify', confirmPayment);
router.get('/booking/:bookingId', getPaymentStatus);

export default router;