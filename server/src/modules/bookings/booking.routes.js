import express from 'express';
import { createBooking, getMyBookings } from './booking.controller.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getMyBookings); // <--- Changed from '/bookings' to '/'

export default router;