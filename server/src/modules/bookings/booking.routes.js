import express from 'express';
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getOccupiedSeats,
  deleteBooking,
} from './booking.controller.js';

const router = express.Router();

// 1. Specific collection endpoints
router.post('/', createBooking);
router.get('/', getMyBookings);
router.get('/occupied-seats/:eventId', getOccupiedSeats);

// 2. Dynamic parameter endpoints
router.patch('/:id/status', updateBookingStatus);
router.patch('/:id', updateBookingStatus);
router.put('/:id', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;