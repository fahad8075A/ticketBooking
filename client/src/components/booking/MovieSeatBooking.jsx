import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Film } from "lucide-react";

const MOVIE_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const MOVIE_OCCUPIED = ["C4", "C5", "D6", "E5", "E6"];

export default function MovieSeatBooking({ item, onBack, onProceed }) {
  const [selected, setSelected] = useState([]);
  const ticketPrice = item?.price || 250;

  const toggleSeat = (id) => {
    if (MOVIE_OCCUPIED.includes(id)) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selected.length * ticketPrice;

  return (
    <div className="w-full max-w-lg bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center mx-auto my-6 font-sans">
      <div className="w-full flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-slate-200" />
        </button>
        <div className="text-center">
          <span className="text-[10px] text-sky-400 uppercase font-bold flex items-center justify-center gap-1">
            <Film className="w-3 h-3" /> Cinema Screen
          </span>
          <h2 className="text-base font-bold text-white">{item?.title || "Movie Show"}</h2>
        </div>
        <div className="w-8" />
      </div>

      <div className="w-3/4 h-2 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 rounded-full shadow-[0_0_25px_rgba(56,189,248,0.7)] mb-2" />
      <p className="text-[10px] tracking-widest uppercase text-slate-400 mb-8">Screen This Way</p>

      <div className="space-y-2 mb-6">
        {MOVIE_ROWS.map((row) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className="w-4 text-[10px] font-bold text-slate-500">{row}</span>
            <div className="flex gap-1.5">
              {Array.from({ length: 10 }, (_, idx) => {
                const id = `${row}${idx + 1}`;
                const isBooked = MOVIE_OCCUPIED.includes(id);
                const isSelected = selected.includes(id);
                return (
                  <button
                    key={id}
                    disabled={isBooked}
                    onClick={() => toggleSeat(id)}
                    className={`w-6 h-6 rounded-t-lg text-[9px] font-bold transition-all ${
                      isBooked
                        ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                        : isSelected
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/40 scale-110"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                    } ${idx === 4 ? "mr-4" : ""}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full pt-4 border-t border-slate-800 flex justify-between items-center">
        <div>
          <span className="text-[11px] text-slate-400 block">
            {selected.length ? `Selected: ${selected.join(", ")}` : "Select seats"}
          </span>
          <span className="text-lg font-bold text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>
        <button
          disabled={!selected.length}
          onClick={() => onProceed({ selectedSeats: selected, totalPrice })}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}