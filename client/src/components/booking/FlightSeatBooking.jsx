import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plane,
  Info,
  Check,
  User,
  ShieldCheck,
} from "lucide-react";

const ROWS = Array.from({ length: 15 }, (_, i) => i + 10);
const TOP_SEATS = ["F", "E", "D"];
const BOTTOM_SEATS = ["C", "B", "A"];

export default function FlightSeatBooking({ item: propItem, onBack, onProceed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const item = propItem || location.state?.item || location.state?.event || null;
  const eventId = item?._id || item?.id;

  const rawLocation = item?.location || item?.route || "HYD → RUH";
  const [departure, arrival] = rawLocation.includes("→")
    ? rawLocation.split("→").map((s) => s.trim())
    : rawLocation.includes("-")
    ? rawLocation.split("-").map((s) => s.trim())
    : ["HYD", "RUH"];

  const seatBasePrice = Number(item?.price || item?.ticketPrice || 4999);

  // Live state
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  // Start with clean, unassigned passengers
  const [passengers, setPassengers] = useState([
    { id: 1, name: "Passenger 1", seat: "" },
    { id: 2, name: "Passenger 2", seat: "" },
  ]);

  const [activePassengerId, setActivePassengerId] = useState(1);

  const rawBase = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");
  const baseUrl = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;

  // Fetch occupied seats on mount
  useEffect(() => {
    if (!eventId) return;

    const fetchOccupied = async () => {
      try {
        const res = await fetch(`${baseUrl}/bookings/occupied-seats/${eventId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.occupiedSeats)) {
          setOccupiedSeats(
            data.occupiedSeats.map((s) => String(s).trim().toUpperCase())
          );
        }
      } catch (err) {
        console.error("Failed to load occupied seats:", err);
      }
    };

    fetchOccupied();
  }, [eventId, baseUrl]);

  // Robust check
  const isSeatOccupied = (seatCode) => {
    const clean = String(seatCode).trim().toUpperCase();
    return occupiedSeats.includes(clean);
  };

  const getAssignedPassenger = (seatCode) =>
    passengers.find(
      (p) => p.seat && p.seat.toUpperCase() === String(seatCode).toUpperCase()
    );

  const handleSeatClick = (seatCode) => {
    const cleanCode = String(seatCode).trim().toUpperCase();

    // Block completely if occupied
    if (isSeatOccupied(cleanCode)) {
      return;
    }

    // Toggle off if already assigned to a passenger
    const assigned = getAssignedPassenger(cleanCode);
    if (assigned) {
      setPassengers((prev) =>
        prev.map((p) => (p.id === assigned.id ? { ...p, seat: "" } : p))
      );
      return;
    }

    // Assign to active passenger
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === activePassengerId ? { ...p, seat: cleanCode } : p
      )
    );

    // Auto-advance cursor to next passenger without a seat
    const nextUnassigned = passengers.find(
      (p) => p.id !== activePassengerId && !p.seat
    );
    if (nextUnassigned) {
      setActivePassengerId(nextUnassigned.id);
    }
  };

  const selectedSeats = passengers
    .map((p) => p.seat)
    .filter((seat) => Boolean(seat));

  const totalCalculatedPrice = selectedSeats.length * seatBasePrice;

  const handleClose = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Safe navigation directly to Payment without saving prematurely
  const handleSaveAndContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before continuing.");
      return;
    }

    // Pre-check against live occupied seats
    const conflict = selectedSeats.some((seat) => isSeatOccupied(seat));
    if (conflict) {
      alert("One or more chosen seats are already occupied. Reselect seats.");
      return;
    }

    const bookingPayload = {
      item,
      event: item,
      eventId,
      selectedSeats,
      numberOfSeats: selectedSeats.length,
      quantity: selectedSeats.length,
      ticketPrice: seatBasePrice,
      totalPrice: totalCalculatedPrice,
      passengers,
    };

    if (typeof onProceed === "function") {
      onProceed(bookingPayload);
    } else {
      navigate("/payment", { state: bookingPayload });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-5xl bg-[#0b1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070d18]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Select Your Seat
                <Info className="w-3.5 h-3.5 text-slate-500 cursor-pointer" />
              </h2>
              <p className="text-[11px] text-slate-400">
                Click any available seat to assign to the active passenger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-xl text-xs font-bold text-sky-400">
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-white" />
              <span>
                {departure} - {arrival}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-white" />
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cabin Seating Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] flex-1 overflow-y-auto">
          <div className="p-5 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#060b14]/50">
            <div className="overflow-x-auto pb-4 no-scrollbar">
              <div className="min-w-[620px] relative bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-3 px-8">
                  <span>Exit Door</span>
                  <span>Exit Door</span>
                </div>

                {/* Top Block: F, E, D */}
                <div className="space-y-2">
                  {TOP_SEATS.map((letter) => (
                    <div key={letter} className="flex items-center gap-2">
                      <span className="w-4 text-[11px] font-bold text-slate-500 text-center">
                        {letter}
                      </span>
                      <div className="flex items-center gap-2 flex-1 justify-between">
                        {ROWS.map((row) => {
                          const seatCode = `${row}${letter}`;
                          const occupied = isSeatOccupied(seatCode);
                          const isAssigned = Boolean(getAssignedPassenger(seatCode));

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={occupied}
                              onClick={() => {
                                if (!occupied) handleSeatClick(seatCode);
                              }}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold transition flex items-center justify-center border ${
                                occupied
                                  ? "bg-slate-800/20 border-slate-800/50 text-slate-600 cursor-not-allowed pointer-events-none opacity-40 shadow-none"
                                  : isAssigned
                                  ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 cursor-pointer"
                                  : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-sky-400 hover:text-white cursor-pointer"
                              }`}
                            >
                              {occupied ? "✕" : isAssigned ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : (
                                letter
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Aisle */}
                <div className="my-4 py-1.5 flex items-center gap-2 border-y border-dashed border-slate-800/80">
                  <span className="w-4" />
                  <div className="flex items-center gap-2 flex-1 justify-between px-1">
                    {ROWS.map((row) => (
                      <span
                        key={row}
                        className="w-7 sm:w-8 text-center text-[10px] font-bold text-slate-500"
                      >
                        {row}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Block: C, B, A */}
                <div className="space-y-2">
                  {BOTTOM_SEATS.map((letter) => (
                    <div key={letter} className="flex items-center gap-2">
                      <span className="w-4 text-[11px] font-bold text-slate-500 text-center">
                        {letter}
                      </span>
                      <div className="flex items-center gap-2 flex-1 justify-between">
                        {ROWS.map((row) => {
                          const seatCode = `${row}${letter}`;
                          const occupied = isSeatOccupied(seatCode);
                          const isAssigned = Boolean(getAssignedPassenger(seatCode));

                          return (
                            <button
                              key={seatCode}
                              type="button"
                              disabled={occupied}
                              onClick={() => {
                                if (!occupied) handleSeatClick(seatCode);
                              }}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold transition flex items-center justify-center border ${
                                occupied
                                  ? "bg-slate-800/20 border-slate-800/50 text-slate-600 cursor-not-allowed pointer-events-none opacity-40 shadow-none"
                                  : isAssigned
                                  ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 cursor-pointer"
                                  : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-sky-400 hover:text-white cursor-pointer"
                              }`}
                            >
                              {occupied ? "✕" : isAssigned ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : (
                                letter
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-slate-900 border border-slate-700" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-slate-800/20 border border-slate-800/50 text-slate-600 text-[10px] flex items-center justify-center">✕</div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-emerald-500 border border-emerald-400" />
                <span className="text-emerald-400 font-semibold">Selected</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Standard Boeing 737 Layout</span>
              </div>
            </div>
          </div>

          {/* Passenger Assignment Side Panel */}
          <div className="p-6 bg-[#070d18] flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h3 className="text-base font-bold text-white">
                  {item?.title || "IndiGo Flight"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {departure} &rarr; {arrival}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Schedule: {item?.date || "Upcoming"}
                </p>
              </div>

              <hr className="border-slate-800 mb-5" />

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Assign Passengers
                </h4>

                <div className="space-y-2.5">
                  {passengers.map((p) => {
                    const isActive = p.id === activePassengerId;

                    return (
                      <div
                        key={p.id}
                        onClick={() => setActivePassengerId(p.id)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
                          isActive
                            ? "bg-sky-500/10 border-sky-400/80 shadow-md shadow-sky-500/10"
                            : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                              isActive
                                ? "bg-sky-500 text-white"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {isActive ? "Selecting seat..." : "Click to assign"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {p.seat ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs">
                              {p.seat}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-500 font-bold text-xs">
                              --
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Total Fare ({selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""})
                </span>
                <span className="text-base font-black text-white">
                  ₹{totalCalculatedPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-95 cursor-pointer"
              >
                <span>Confirm Seats</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}