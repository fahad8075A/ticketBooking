import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Utensils,
  Calendar,
  Minus,
  Plus,
  Ticket,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function GeneralTicketBooking({ item: propItem, onBack, onProceed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const item = propItem || location.state?.item || location.state?.event || {};
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketTier, setTicketTier] = useState("standard");

  const basePrice = Number(item?.price || item?.ticketPrice || 499);
  const tierMultiplier = ticketTier === "vip" ? 1.8 : 1;
  const unitPrice = Math.round(basePrice * tierMultiplier);
  const totalPrice = ticketCount * unitPrice;

  const isFood = (item?.category || "").toString().toLowerCase().includes("food");

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleContinue = () => {
    const payload = {
      item,
      event: item,
      eventId: item?._id || item?.id,
      quantity: ticketCount,
      numberOfSeats: ticketCount,
      selectedSeats: Array.from(
        { length: ticketCount },
        (_, i) => `${ticketTier.toUpperCase()}-PASS-${i + 1}`
      ),
      totalPrice,
      ticketType: ticketTier === "vip" ? "VIP All-Access" : "Standard Entry",
      ticketPrice: unitPrice,
    };

    if (typeof onProceed === "function") {
      onProceed(payload);
    } else {
      navigate("/payment", { state: payload });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-zinc-100 py-10 px-4 sm:px-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-lg bg-[#0f1420] border border-zinc-800/90 rounded-[32px] shadow-2xl overflow-hidden flex flex-col backdrop-blur-md">
        
        {/* Header Ribbon */}
        <div className="bg-[#0b0e17] p-6 border-b border-zinc-800/80">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleBack}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Instant Pass</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-sky-400 flex items-center gap-1.5">
              {isFood ? <Utensils className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              {item?.category || "Special Event"} Admission
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {item?.title || item?.name || "Official Entry Pass"}
            </h1>
            <p className="text-xs text-zinc-400 flex items-center gap-2 pt-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{item?.location || "Main Arena / Event Grounds"}</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6 bg-[#0f1420]">
          
          {/* Tier Selection */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2.5">
              Select Pass Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTicketTier("standard")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  ticketTier === "standard"
                    ? "bg-sky-500/15 border-sky-500 text-white shadow-lg shadow-sky-500/10"
                    : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Standard Pass</span>
                  {ticketTier === "standard" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">Regular general admission</p>
                <p className="text-sm font-black text-sky-400 mt-2">₹{basePrice}</p>
              </button>

              <button
                type="button"
                onClick={() => setTicketTier("vip")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  ticketTier === "vip"
                    ? "bg-purple-500/15 border-purple-500 text-white shadow-lg shadow-purple-500/10"
                    : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">VIP Priority</span>
                  {ticketTier === "vip" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">Fast-track line & perks</p>
                <p className="text-sm font-black text-purple-400 mt-2">₹{Math.round(basePrice * 1.8)}</p>
              </button>
            </div>
          </div>

          {/* Ticket Preview Card */}
          <div className="relative bg-[#07090e] border border-zinc-800/80 rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between border-b border-dashed border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sky-400">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {ticketTier === "vip" ? "VIP All-Access Pass" : "Standard Entry Pass"}
                  </h3>
                  <p className="text-[11px] text-zinc-400">Single day pass • Non-refundable</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">
                ₹{unitPrice}/pass
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300">Quantity</span>
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  type="button"
                  disabled={ticketCount <= 1}
                  onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-white min-w-[24px] text-center font-mono">
                  {ticketCount}
                </span>
                <button
                  type="button"
                  disabled={ticketCount >= 10}
                  onClick={() => setTicketCount((prev) => Math.min(10, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Perks Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>QR Verified Entry</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Immediate Delivery</span>
            </div>
          </div>

        </div>

        {/* Bottom Total & Action Bar */}
        <div className="p-5 bg-[#0b0e17] border-t border-zinc-800/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Total Payable ({ticketCount} {ticketCount > 1 ? "passes" : "pass"})
            </span>
            <span className="text-2xl font-black text-white tracking-tight">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer"
          >
            <span>Proceed to Pay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}