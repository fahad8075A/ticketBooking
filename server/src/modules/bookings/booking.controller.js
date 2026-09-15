import mongoose from 'mongoose';
import { Booking } from './booking.model.js';

// Safe retrieval of the Event model
const getEventModel = () => {
  return mongoose.models.Event || mongoose.model('Event');
};

// 1. Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      eventId,
      selectedSeats,
      numberOfSeats,
      totalPrice,
    } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event/Listing ID is required.' });
    }

    // Cast eventId to valid Mongo ObjectId
    const cleanEventId = mongoose.Types.ObjectId.isValid(eventId)
      ? new mongoose.Types.ObjectId(eventId)
      : eventId;

    // Normalize seat strings (e.g., " 14a " -> "14A")
    const rawSeats = Array.isArray(selectedSeats) ? selectedSeats : [];
    const normalizedSeats = rawSeats
      .map((seat) => String(seat).trim().toUpperCase())
      .filter((seat) => seat.length > 0);

    const seatsCount =
      Number(numberOfSeats) || (normalizedSeats.length > 0 ? normalizedSeats.length : 1);

    const EventModel = getEventModel();
    const event = await EventModel.findById(cleanEventId);

    if (!event) {
      return res.status(404).json({ message: 'Listing document not found.' });
    }

    if (typeof event.availableSeats === 'number' && event.availableSeats < seatsCount) {
      return res.status(400).json({ message: 'Not enough seats available.' });
    }

    // Double-Booking Guard: Check both ObjectId and String forms
    if (normalizedSeats.length > 0) {
      const conflictingBookings = await Booking.find({
        $or: [{ eventId: cleanEventId }, { eventId: String(eventId) }],
        status: { $ne: 'cancelled' },
        selectedSeats: { $in: normalizedSeats },
      });

      if (conflictingBookings.length > 0) {
        const takenSeats = conflictingBookings.flatMap((b) => b.selectedSeats || []);
        const conflicts = normalizedSeats.filter((s) => takenSeats.includes(s));

        return res.status(400).json({
          message: `The following seat(s) are already booked: ${conflicts.join(', ')}. Please select different seats.`,
        });
      }
    }

    // Save booking
    const booking = await Booking.create({
      userId: userId || req.user?._id || req.user?.id || null,
      customerName: customerName || 'Passenger',
      customerEmail: (customerEmail || req.user?.email || 'passenger@flexibook.com').trim().toLowerCase(),
      eventId: cleanEventId,
      selectedSeats: normalizedSeats,
      numberOfSeats: seatsCount,
      totalPrice: Number(totalPrice) || 0,
      status: 'confirmed',
    });

    // Atomically decrement available seats on the event
    await EventModel.findByIdAndUpdate(cleanEventId, {
      $inc: {
        availableSeats: -seatsCount,
        bookedSeatsCount: seatsCount,
      },
    });

    const populatedBooking = await Booking.findById(booking._id).populate('eventId');
    return res.status(201).json(populatedBooking);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 2. Fetch occupied seats
export const getOccupiedSeats = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || eventId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Valid Event ID is required.' });
    }

    const cleanEventId = mongoose.Types.ObjectId.isValid(eventId)
      ? new mongoose.Types.ObjectId(eventId)
      : eventId;

    const activeBookings = await Booking.find({
      $or: [{ eventId: cleanEventId }, { eventId: String(eventId) }],
      status: { $ne: 'cancelled' },
    }).select('selectedSeats');

    const occupiedSeats = activeBookings
      .flatMap((booking) => booking.selectedSeats || [])
      .map((seat) => String(seat).trim().toUpperCase())
      .filter((seat) => seat.length > 0);

    return res.status(200).json({
      success: true,
      occupiedSeats: [...new Set(occupiedSeats)],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get bookings (Admin returns all; user requests filter by userId / email)
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.query.userId || req.user?._id || req.user?.id;
    const email = req.query.email || req.user?.email;

    const conditions = [];

    // Filter by userId if supplied
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      conditions.push({ userId: new mongoose.Types.ObjectId(userId) });
      conditions.push({ userId: String(userId) });
    } else if (userId) {
      conditions.push({ userId: String(userId) });
    }

    // Filter by email if supplied
    if (email && typeof email === 'string' && email.trim() !== '') {
      conditions.push({ customerEmail: email.trim().toLowerCase() });
    }

    // When no filter params are sent (e.g. Admin view), query returns ALL documents
    const query = conditions.length > 0 ? { $or: conditions } : {};

    const bookings = await Booking.find(query)
      .populate('eventId')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Update status, adjust capacity, & allow date reschedule
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID format.' });
    }

    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const EventModel = getEventModel();
    const count = existingBooking.numberOfSeats || existingBooking.selectedSeats?.length || 1;

    // Handle status changes and adjust seat capacity
    if (status) {
      if (!['confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be 'confirmed' or 'cancelled'.",
        });
      }

      if (existingBooking.status === 'confirmed' && status === 'cancelled') {
        await EventModel.findByIdAndUpdate(existingBooking.eventId, {
          $inc: { availableSeats: count, bookedSeatsCount: -count },
        });
      }

      if (existingBooking.status === 'cancelled' && status === 'confirmed') {
        await EventModel.findByIdAndUpdate(existingBooking.eventId, {
          $inc: { availableSeats: -count, bookedSeatsCount: count },
        });
      }

      existingBooking.status = status;
    }

    // Handle date rescheduling
    if (date) {
      existingBooking.date = date;
    }

    const updated = await existingBooking.save();
    await updated.populate('eventId');

    return res.status(200).json({ 
      success: true, 
      message: 'Booking updated successfully', 
      booking: updated 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. Delete booking permanently & restore event capacity
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID format.' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found.' });
    }

    // Only restore seats to the event if the booking was active/confirmed
    if (booking.status === 'confirmed' && booking.eventId) {
      const EventModel = getEventModel();
      const count = booking.numberOfSeats || booking.selectedSeats?.length || 1;

      await EventModel.findByIdAndUpdate(booking.eventId, {
        $inc: { availableSeats: count, bookedSeatsCount: -count },
      });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully and seats restored.',
      deletedId: id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};