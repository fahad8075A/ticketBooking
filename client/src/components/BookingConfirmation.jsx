import React, { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { QRCodeCanvas } from "qrcode.react";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSavedRef = useRef(false);

  const {
    event,
    ticketPrice = 0,
    serviceFee = 0,
    tax = 0,
    total = 0,
    quantity = 1,
    paymentMethod = "Card",
    ticketType = "Standard Entry",
    name = "Guest",
  } = location.state || {};

  const bookingId = useMemo(() => {
    return (
      location.state?.bookingId ||
      `FB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    );
  }, [location.state?.bookingId]);

  useEffect(() => {
    if (!event || hasSavedRef.current) return;

    const newBooking = {
      bookingId,
      event,
      ticketPrice,
      serviceFee,
      tax,
      total,
      quantity,
      ticketType,
      name,
      paymentMethod,
      bookingDate: new Date().toLocaleDateString(),
    };

    try {
      const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const alreadyExists = existingBookings.some((b) => b.bookingId === bookingId);

      if (!alreadyExists) {
        existingBookings.unshift(newBooking);
        localStorage.setItem("bookings", JSON.stringify(existingBookings));
      }

      hasSavedRef.current = true;
    } catch (error) {
      console.error("Failed to save booking:", error);
    }
  }, [bookingId, event, ticketPrice, serviceFee, tax, total, quantity, ticketType, name, paymentMethod]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm max-w-md w-full">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Booking Information Not Found
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            No active booking session was detected.
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="mt-6 bg-[#1a56db] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors w-full cursor-pointer"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-3 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Status */}
        <div className="text-center py-6 sm:py-8 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl sm:text-3xl shadow-sm">
            <IoMdCheckmarkCircle />
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 mt-3 sm:mt-4">
            Booking Confirmed!
          </h2>

          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for your booking. Your ticket has been confirmed and stored in your wallet.
          </p>
        </div>

        {/* Ticket Details Box */}
        <div className="mx-3 sm:mx-8 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-[#1e4b6d]">Flexibook</h3>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                Booking ID
              </p>
              <p className="font-mono font-bold text-gray-800 text-sm sm:text-base">
                {bookingId}
              </p>
            </div>

            <div className="p-2 border border-gray-200 rounded-lg bg-white shadow-xs shrink-0">
              <QRCodeCanvas value={bookingId} size={76} level="H" />
            </div>
          </div>

          <hr className="my-4 sm:my-5 border-gray-100" />

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Event
              </p>
              <p className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">{event.title}</p>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Venue
              </p>
              <p className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">{event.location}</p>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Date & Time
              </p>
              <p className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">{event.date}</p>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Quantity & Type
              </p>
              <p className="font-semibold text-xs sm:text-sm text-gray-800 mt-0.5">
                {quantity} {quantity === 1 ? "Ticket" : "Tickets"} ({ticketType})
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-5">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Payment Method
            </p>
            <p className="font-semibold uppercase text-xs sm:text-sm text-gray-800 mt-0.5">
              {paymentMethod}
            </p>
          </div>

          {/* Receipt Breakdown */}
          <div className="mt-5 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100 text-xs sm:text-sm">
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Ticket Price ({quantity}x)</span>
              <span className="font-medium text-gray-800">₹{ticketPrice}</span>
            </div>

            <div className="flex justify-between mb-2 text-gray-600">
              <span>Service Fee</span>
              <span className="font-medium text-gray-800">₹{serviceFee}</span>
            </div>

            <div className="flex justify-between mb-3 text-gray-600">
              <span>Tax</span>
              <span className="font-medium text-gray-800">₹{tax}</span>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between mt-3 text-sm sm:text-base">
              <span className="font-bold text-gray-800">Total Amount</span>
              <span className="font-bold text-[#1e4b6d]">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 py-6 sm:py-8 px-4">
          <button
            onClick={() => navigate("/booking")}
            className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            View All Tickets
          </button>

          <button
            onClick={() => navigate("/browsing")}
            className="w-full sm:w-auto bg-[#1a56db] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer"
          >
            Book Another Ticket →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;