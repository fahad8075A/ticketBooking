import { Booking } from "./booking.model.js";
import { Event } from "../events/event.model.js";

export const bookTickets = async ({
  userId,
  eventId,
  numberOfSeats,
  customerName,
  customerEmail,
  totalPrice,
}) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Check and deduct available seats only if tracked as a valid number
  const currentSeats = event.availbleSeats ?? event.availableSeats;
  if (typeof currentSeats === "number") {
    if (currentSeats < numberOfSeats) {
      throw new Error("Not enough seats available");
    }
    if (event.availbleSeats !== undefined) event.availbleSeats -= numberOfSeats;
    if (event.availableSeats !== undefined) event.availableSeats -= numberOfSeats;

    // bypass strict schema validation on legacy fields
    await event.save({ validateBeforeSave: false });
  }

  // Calculate total: prefer incoming frontend total, fallback to event price calculation
  const calculatedTotal =
    totalPrice ||
    Number(numberOfSeats) * (event.pricePerSeat || event.price || 0);

  // Capitalized Booking.create to prevent runtime TypeError
  const booking = await Booking.create({
    userId: userId || null,
    customerName: customerName || "Guest Passenger",
    customerEmail: customerEmail || "guest@example.com",
    eventId,
    numberOfSeats: Number(numberOfSeats) || 1,
    totalPrice: calculatedTotal,
    status: "confirmed",
  });

  return await booking.populate("eventId");
};

export const getUserBookings = async (userId) => {
  return await Booking.find({ userId })
    .populate("eventId")
    .sort({ createdAt: -1 });
};

export const getAllBookings = async () => {
  return await Booking.find()
    .populate("eventId")
    .sort({ createdAt: -1 });
};