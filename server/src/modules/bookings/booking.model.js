import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // allows guest bookings if auth isn't enforced yet
    },
    customerName: { 
      type: String, 
      required: true 
    },
    customerEmail: { 
      type: String, 
      required: true 
    },
    eventId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    // Required to persist seat codes in MongoDB
    selectedSeats: {
      type: [String],
      default: [],
    },
    numberOfSeats: { 
      type: Number, 
      required: true,
      default: 1
    },
    totalPrice: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['confirmed', 'cancelled'], 
      default: 'confirmed' 
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;