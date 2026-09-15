import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Train,
  ArrowLeft,
  User,
  Check,
  Armchair,
  X as XIcon,
} from "lucide-react";

// Cabin layout: 3 x 3 vertical grid (A, B, C - Aisle - D, E, F)
const SEAT_LETTERS_LEFT = ["A", "B", "C"];
const SEAT_LETTERS_RIGHT = ["D", "E", "F"];
const SEAT_ROWS = Array.from({ length: 11 }, (_, i) => i + 6); // Rows 6 to 16

export default function TrainDetails({ item: propItem, onBack, onProceed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const item = propItem || location.state?.item || location.state?.event || {};
  const eventId = item?._id || item?.id;

  const basePrice = Number(
    item.price ?? item.ticketPrice ?? item.pricePerSeat ?? 450
  );

  // Leg pill tabs
  const routePills = [
    { code: "HAJ-ZRH", label: `${item.from || "HAJ"} - ${item.to || "ZRH"}` },
    { code: "ZRH-MIL", label: "ZRH - MIL" },
    { code: "MIL-FRA", label: "MIL - FRA" },
    { code: "FRA-HAJ", label: "FRA - HAJ" },
  ];

  const [activeLeg, setActiveLeg] = useState("HAJ-ZRH");
  
  // Booked / Occupied seats (will be rendered in PINK)
  const [occupiedSeats, setOccupiedSeats] = useState([
    "6A", "6B", "6C", "6F", 
    "9A", "11A", "11B", "11C", 
    "12A", "12B", "12C", "14A"
  ]);

  // Passengers list
  const [passengers, setPassengers] = useState([
    { id: 1, name: "Passenger 1", seat: "7F" },
    { id: 2, name: "Passenger 2", seat: "" },
  ]);
  const [activePassengerId, setActivePassengerId] = useState(2);

  const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const baseUrl = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;

  // Fetch live occupied seats from backend
  useEffect(() => {
    if (!eventId) return;

    const fetchOccupied = async () => {
      try {
        const res = await fetch(`${baseUrl}/bookings/occupied-seats/${eventId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.occupiedSeats)) {
          setOccupiedSeats((prev) => [
            ...new Set([...prev, ...data.occupiedSeats.map((s) => String(s).trim().toUpperCase())]),
          ]);
        }
      } catch (err) {
        console.warn("Using default occupied seats:", err);
      }
    };

    fetchOccupied();
  }, [eventId, baseUrl]);

  const isOccupied = (seatId) => occupiedSeats.includes(seatId.toUpperCase());
  const getAssignedPassenger = (seatId) =>
    passengers.find((p) => p.seat.toUpperCase() === seatId.toUpperCase());

  // Handle seat clicks
  const handleSeatClick = (seatId) => {
    // Cannot click booked/pink seats
    if (isOccupied(seatId)) return;

    // If clicking an already selected seat, release it
    const assigned = getAssignedPassenger(seatId);
    if (assigned) {
      setPassengers((prev) =>
        prev.map((p) => (p.id === assigned.id ? { ...p, seat: "" } : p))
      );
      return;
    }

    // Assign free blue seat to active passenger
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === activePassengerId ? { ...p, seat: seatId } : p
      )
    );

    // Auto-advance to next empty passenger
    const nextUnassigned = passengers.find(
      (p) => p.id !== activePassengerId && !p.seat
    );
    if (nextUnassigned) {
      setActivePassengerId(nextUnassigned.id);
    }
  };

  const selectedSeats = passengers.filter((p) => Boolean(p.seat));
  const totalAmount = (selectedSeats.length || 1) * basePrice;

  // Proceed to payment
  const handleConfirmReservation = () => {
    const assignedSeatsList = selectedSeats.map((p) => p.seat);
    if (assignedSeatsList.length === 0) {
      alert("Please select a place for at least one passenger.");
      return;
    }

    const payload = {
      item,
      event: item,
      eventId,
      selectedSeats: assignedSeatsList,
      numberOfSeats: assignedSeatsList.length,
      quantity: assignedSeatsList.length,
      ticketPrice: basePrice,
      totalPrice: totalAmount,
      passengers,
    };

    if (typeof onProceed === "function") {
      onProceed(payload);
    } else {
      navigate("/payment", { state: payload });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-zinc-100 py-6 px-3 sm:px-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-4xl bg-[#0f1420] border border-zinc-800/90 rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Select the places for your journey
            </h1>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
            {item.category || "EXPRESS"}
          </span>
        </div>

        {/* Route Segment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {routePills.map((leg) => {
            const isCurrent = leg.code === activeLeg;
            return (
              <button
                key={leg.code}
                type="button"
                onClick={() => setActiveLeg(leg.code)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? "bg-zinc-800/90 border border-zinc-700 text-white shadow-sm"
                    : "bg-zinc-950/60 border border-zinc-900 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Train className={`w-3.5 h-3.5 ${isCurrent ? "text-pink-500" : "text-zinc-600"}`} />
                <span>{leg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-banner */}
        <div className="bg-[#141b2c] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Armchair className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-sky-400">
                Window or corridor?
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Blue slots are available. Pink slots are already booked.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-white">
              ₹{basePrice}
            </span>
            <p className="text-[10px] text-zinc-500 font-medium">per ticket</p>
          </div>
        </div>

        {/* Layout Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Left: Passenger List & Color Legend */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                {item.trainNumber ? `Train #${item.trainNumber}` : "Sector #1"}
              </p>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                {item.departureStation || item.from || "Hannover (HAJ)"} - {item.arrivalStation || item.to || "Milan (MIL)"}
              </h2>
            </div>

            {/* Passenger Assignment Selectors */}
            <div className="flex flex-col gap-2.5">
              {passengers.map((p) => {
                const isActive = p.id === activePassengerId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePassengerId(p.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
                      isActive
                        ? "bg-purple-500/15 border-purple-500/80 shadow-md shadow-purple-500/10"
                        : "bg-zinc-950/70 border-zinc-900 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                          isActive ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">{p.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="text-zinc-500 text-[11px]">Place:</span>
                      <span className="font-extrabold text-white">
                        {p.seat || "— —"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Updated Color Legend */}
            <div className="bg-[#0b0e17] border border-zinc-800/80 rounded-2xl p-4 flex flex-col gap-3">
              {/* Free Slot -> Blue */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-sky-500 border border-sky-400 shadow-sm" />
                  <span className="text-zinc-200 font-semibold">Free Slot</span>
                </div>
                <span className="text-sky-400 font-bold font-mono">Available</span>
              </div>

              {/* Booked Slot -> Pink */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-pink-500 border border-pink-400 flex items-center justify-center text-white text-[10px]">
                    <XIcon className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-zinc-200 font-semibold">Booked Slot</span>
                </div>
                <span className="text-pink-400 font-bold font-mono">Occupied</span>
              </div>

              {/* Selected Slot */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-purple-600 border border-purple-400 flex items-center justify-center text-white text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="text-zinc-200 font-semibold">Selected Place</span>
                </div>
                <span className="text-purple-400 font-bold font-mono">Assigned</span>
              </div>
            </div>
          </div>

          {/* Right: Seat Matrix (3 x Aisle x 3) */}
          <div className="lg:col-span-7 bg-[#0b0e17] border border-zinc-800/80 rounded-3xl p-5 sm:p-6 flex flex-col items-center">
            
            {/* Column Letter Headers */}
            <div className="grid grid-cols-[1fr_24px_1fr] w-full max-w-xs mb-3 text-center text-xs font-bold text-zinc-500 font-mono">
              <div className="grid grid-cols-3 gap-2">
                {SEAT_LETTERS_LEFT.map((letter) => (
                  <span key={letter}>{letter}</span>
                ))}
              </div>
              <span />
              <div className="grid grid-cols-3 gap-2">
                {SEAT_LETTERS_RIGHT.map((letter) => (
                  <span key={letter}>{letter}</span>
                ))}
              </div>
            </div>

            {/* Vertical Seat Rows */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {SEAT_ROWS.map((rowNumber) => (
                <div
                  key={rowNumber}
                  className="grid grid-cols-[1fr_24px_1fr] items-center w-full gap-0"
                >
                  {/* Left 3 Seats: A, B, C */}
                  <div className="grid grid-cols-3 gap-2">
                    {SEAT_LETTERS_LEFT.map((letter) => {
                      const seatId = `${rowNumber}${letter}`;
                      const occupied = isOccupied(seatId);
                      const assigned = getAssignedPassenger(seatId);

                      // Blue for free, Pink for booked, Purple for assigned
                      let seatStyles = "bg-sky-500 border-sky-400 text-white hover:bg-sky-400 hover:scale-105 active:scale-95 cursor-pointer shadow-sm";

                      if (occupied) {
                        seatStyles = "bg-pink-500 border-pink-400 text-white cursor-not-allowed pointer-events-none opacity-90 shadow-sm";
                      } else if (assigned) {
                        seatStyles = "bg-purple-600 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.7)] scale-105";
                      }

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={occupied}
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${seatStyles}`}
                        >
                          {occupied ? (
                            <XIcon className="w-3.5 h-3.5 stroke-[3]" />
                          ) : assigned ? (
                            <User className="w-3.5 h-3.5" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Central Row Number Aisle */}
                  <span className="text-center text-[10px] font-mono font-bold text-zinc-600 select-none">
                    {rowNumber}
                  </span>

                  {/* Right 3 Seats: D, E, F */}
                  <div className="grid grid-cols-3 gap-2">
                    {SEAT_LETTERS_RIGHT.map((letter) => {
                      const seatId = `${rowNumber}${letter}`;
                      const occupied = isOccupied(seatId);
                      const assigned = getAssignedPassenger(seatId);

                      // Blue for free, Pink for booked, Purple for assigned
                      let seatStyles = "bg-sky-500 border-sky-400 text-white hover:bg-sky-400 hover:scale-105 active:scale-95 cursor-pointer shadow-sm";

                      if (occupied) {
                        seatStyles = "bg-pink-500 border-pink-400 text-white cursor-not-allowed pointer-events-none opacity-90 shadow-sm";
                      } else if (assigned) {
                        seatStyles = "bg-purple-600 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.7)] scale-105";
                      }

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={occupied}
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${seatStyles}`}
                        >
                          {occupied ? (
                            <XIcon className="w-3.5 h-3.5 stroke-[3]" />
                          ) : assigned ? (
                            <User className="w-3.5 h-3.5" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-black text-white">
              ₹{totalAmount}
            </span>
            <p className="text-[10px] text-zinc-500 font-medium">additional amount to the price</p>
          </div>

          <button
            type="button"
            onClick={handleConfirmReservation}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 active:scale-95 transition cursor-pointer flex items-center gap-2"
          >
            <span>Confirm seats reservation</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </div>
  );
}