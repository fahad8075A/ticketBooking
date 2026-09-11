import { Booking } from './booking.model.js';
import * as bookingService from './booking.service.js';

export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || null;
    const { eventId, numberOfSeats, totalPrice, customerName, customerEmail } = req.body;

    if (!eventId || !customerName || !customerEmail) {
      return res.status(400).json({ message: "Missing required booking details." });
    }

    const booking = await bookingService.bookTickets({
      userId,
      eventId,
      numberOfSeats: Number(numberOfSeats) || 1,
      totalPrice: Number(totalPrice),
      customerName,
      customerEmail,
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to create booking" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.id;

    // If logged in with an auth token, filter by user; otherwise fetch all bookings
    const query = userId ? { userId } : {};

    const bookings = await Booking.find(query)
      .populate('eventId')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getMyBookings:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};