// modules/events/event.model.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    ticketPrice: { type: Number, default: 0 },
    pricePerSeat: { type: Number, default: 0 },
    date: { type: String },
    badge: { type: String, default: "UPCOMING" },
    location: { type: String },
    image: { type: String, default: "food" },
    imageUrl: { type: String },
    rating: { type: Number, default: 4.8 },
    description: { type: String },
  },
  { timestamps: true }
);

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;