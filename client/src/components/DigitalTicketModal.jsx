import React from "react";
import { FaTimes, FaPrint } from "react-icons/fa";

const DigitalTicketModal = ({ ticket, isOpen, onClose }) => {
  if (!isOpen || !ticket) return null;

  const {
    name = "GUEST PASSENGER",
    event = {},
    ticketType = "Standard Entry",
    quantity = 1,
    bookingId = "TRN-826491",
    bookingDate = "16 MAR 2026",
    paymentMethod = "PAID",
  } = ticket;

  const destination = event.location || event.city || "DELHI";
  const origin = event.from || "NEW YORK";
  const title = event.title || "EXPRESS TRANSIT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-[920px]">
        
        {/* Top Control Bar */}
        <div className="w-full flex justify-between items-center mb-3 text-white">
          <span className="font-semibold text-sm tracking-wide">Digital Pass Preview</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-xs px-3 py-1.5 rounded-md font-medium transition cursor-pointer"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full text-sm transition cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Dynamic Boarding Pass / Ticket Card */}
        <div className="w-full bg-white rounded-[26px] shadow-2xl overflow-hidden flex flex-row relative min-h-[380px] border border-gray-100">
          
          {/* 1. Left Gradient Ribbon */}
          <div className="w-14 sm:w-20 bg-gradient-to-b from-[#4438ca] via-[#2563eb] to-[#06b6d4] flex flex-col justify-between items-center py-8 select-none text-white shrink-0">
            <span className="font-extrabold text-xs sm:text-base tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
              FLEXIBOOK
            </span>
            <span className="font-bold text-[10px] sm:text-xs tracking-[0.2em] text-cyan-200 [writing-mode:vertical-rl] rotate-180 uppercase">
              Digital Pass
            </span>
          </div>

          {/* 2. Center Ticket Body */}
          <div className="flex-1 bg-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Geometric Ring Accents */}
            <div className="absolute -top-12 right-12 w-28 h-28 rounded-full border border-indigo-100 pointer-events-none" />
            <div className="absolute -bottom-16 right-0 w-36 h-36 rounded-full border border-indigo-100 pointer-events-none" />

            {/* Passenger & Origin/Destination */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Name of Passenger
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900 mt-0.5 uppercase truncate">
                  {name}
                </p>
              </div>

              <div className="col-span-7 flex items-center gap-2 sm:gap-3">
                <div className="truncate">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    From
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5 uppercase truncate">
                    {origin}
                  </p>
                </div>

                <div className="text-gray-400 text-xs font-mono select-none pt-3">
                  -----&gt;
                </div>

                <div className="truncate">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    To
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5 uppercase truncate">
                    {destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Name & Schedule Info */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Event / Trip</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate">{title}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 whitespace-nowrap">{event.date || bookingDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class / Type</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate">{ticketType}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pass Count</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{quantity} Ticket{quantity > 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Ticket ID & Booking Barcode */}
            <div className="grid grid-cols-12 gap-4 items-end pt-2">
              <div className="col-span-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ticket ID</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 font-mono">{bookingId}</p>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">Payment</p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 uppercase">{paymentMethod}</p>
              </div>

              <div className="col-span-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking Status</p>
                <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 uppercase tracking-wide">
                  CONFIRMED
                </p>
              </div>

              {/* Dynamic Barcode */}
              <div className="col-span-5 flex justify-end">
                <div className="flex items-end gap-[3px] h-11">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2].map((w, i) => (
                    <span
                      key={i}
                      className="bg-gray-900 h-full inline-block"
                      style={{ width: `${w * 1.3}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Scalloped Perforation Line */}
          <div className="relative w-4 bg-[#2b7de9] flex flex-col justify-between py-2 -ml-2 z-10">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 bg-white rounded-full -translate-x-1.5"
              />
            ))}
          </div>

          {/* 4. Right Stub */}
          <div className="w-48 sm:w-56 bg-[#2b7de9] p-5 sm:p-6 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
                  Name of Passenger
                </p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 uppercase truncate">
                  {name}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
                  Destination
                </p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 uppercase truncate">
                  {destination}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
                  Tier / Seat
                </p>
                <p className="text-sm sm:text-base font-extrabold text-white mt-0.5 truncate">
                  {ticketType}
                </p>
              </div>
            </div>

            <div className="text-[9px] text-blue-200 font-mono tracking-wider">
              {bookingId}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DigitalTicketModal;