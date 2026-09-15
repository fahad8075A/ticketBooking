import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bus, Disc, Sparkles } from "lucide-react";

const BUS_ROWS = ["A", "B", "C", "D", "E", "F"];
const BUS_OCCUPIED = ["A2", "B1", "D2", "E1"];

export default function BusSeatBooking({ item: propItem, onBack, onProceed }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Support direct props or React Router state fallback
  const item = propItem || location.state?.item || location.state?.event || {};
  const [selectedSeats, setSelectedSeats] = useState([]);
  const seatPrice = Number(item?.price || item?.ticketPrice || 1599);

  const toggleSeat = (id) => {
    if (BUS_OCCUPIED.includes(id)) return;
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedSeats.length * seatPrice;
  const availableCount = 24 - BUS_OCCUPIED.length - selectedSeats.length;

  const handleClose = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleContinue = () => {
    if (!selectedSeats.length) return;

    const payload = {
      item,
      event: item,
      eventId: item?._id || item?.id,
      selectedSeats,
      numberOfSeats: selectedSeats.length,
      quantity: selectedSeats.length,
      ticketPrice: seatPrice,
      totalPrice,
    };

    if (typeof onProceed === "function") {
      onProceed(payload);
    } else {
      navigate("/payment", { state: payload });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-zinc-200 py-10 px-4 sm:px-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-md bg-[#0f1420] border border-zinc-800/90 rounded-[32px] shadow-2xl overflow-hidden flex flex-col backdrop-blur-md">
        
        {/* Header Banner */}
        <div className="bg-[#0b0e17] p-5 border-b border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {availableCount} Seats Available
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-sky-400 flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5" /> Express Luxury Coach
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight truncate">
              {item?.title || "Bus Seat Selector"}
            </h2>
            <p className="text-xs text-zinc-400">
              Select your preferred window or aisle seats
            </p>
          </div>
        </div>

        {/* Seat Status Legend */}
        <div className="flex justify-around py-3 px-6 bg-[#07090e]/80 border-b border-zinc-800/80 text-[11px] font-medium text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-zinc-900 border border-zinc-700" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-zinc-950 border border-zinc-900 opacity-50" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-sky-500 shadow-sm shadow-sky-500/40" />
            <span className="text-sky-300 font-semibold">Selected</span>
          </div>
        </div>

        {/* Bus Interior Layout */}
        <div className="p-6 flex flex-col items-center bg-[#07090e]">
          {/* Driver Cabin Dashboard */}
          <div className="w-full max-w-[280px] flex justify-between items-center pb-3 mb-5 border-b border-dashed border-zinc-800 text-[11px] text-zinc-500 font-semibold">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-sky-400" /> Front Entry
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
              <Disc className="w-3.5 h-3.5 animate-spin-slow text-sky-400" />
              <span>Steering</span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3.5 w-full max-w-[280px]">
            {BUS_ROWS.map((row) => (
              <div key={row} className="flex justify-between items-center">
                {/* Left 2 Seats */}
                <div className="flex gap-2.5">
                  {[`${row}1`, `${row}2`].map((seatId) => {
                    const isBooked = BUS_OCCUPIED.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 border ${
                          isBooked
                            ? "bg-zinc-950/70 border-zinc-900 text-zinc-700 cursor-not-allowed pointer-events-none opacity-40"
                            : isSelected
                            ? "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/25 scale-105 cursor-pointer"
                            : "bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white cursor-pointer"
                        }`}
                      >
                        <div
                          className={`w-6 h-1 rounded-full mb-1 transition-colors ${
                            isSelected
                              ? "bg-white/80"
                              : isBooked
                              ? "bg-zinc-800"
                              : "bg-zinc-700"
                          }`}
                        />
                        <span>{seatId}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Aisle Row Indicator */}
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest font-mono">
                  {row}
                </span>

                {/* Right 2 Seats */}
                <div className="flex gap-2.5">
                  {[`${row}3`, `${row}4`].map((seatId) => {
                    const isBooked = BUS_OCCUPIED.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 border ${
                          isBooked
                            ? "bg-zinc-950/70 border-zinc-900 text-zinc-700 cursor-not-allowed pointer-events-none opacity-40"
                            : isSelected
                            ? "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/25 scale-105 cursor-pointer"
                            : "bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white cursor-pointer"
                        }`}
                      >
                        <div
                          className={`w-6 h-1 rounded-full mb-1 transition-colors ${
                            isSelected
                              ? "bg-white/80"
                              : isBooked
                              ? "bg-zinc-800"
                              : "bg-zinc-700"
                          }`}
                        />
                        <span>{seatId}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Summary & Checkout Action */}
        <div className="p-5 bg-[#0b0e17] border-t border-zinc-800/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 block truncate max-w-[170px]">
              {selectedSeats.length
                ? `Seats: ${selectedSeats.join(", ")}`
                : "No seats selected"}
            </span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            disabled={!selectedSeats.length}
            onClick={handleContinue}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}