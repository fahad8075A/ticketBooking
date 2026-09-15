import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Users,
  Armchair,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";

const STADIUM_BLOCKS = [
  { id: "BLOCK-A", name: "Block A", tier: "Lower West", price: 2500, category: "SEATING" },
  { id: "BLOCK-B", name: "Block B", tier: "VIP Central", price: 4500, category: "SEATING" },
  { id: "BLOCK-C", name: "Block C", tier: "Lower East", price: 2500, category: "SEATING" },
  { id: "BLOCK-D", name: "Block D", tier: "North Stand", price: 1800, category: "SEATING" },
  { id: "GOLDEN-CIRCLE", name: "Golden Circle", tier: "Pitch Front", price: 5500, category: "BEST AVAILABLE" },
  { id: "STANDING-LAWN", name: "General Standing", tier: "Pitch Center", price: 1200, category: "STANDING" },
  { id: "BLOCK-U1", name: "Upper Tier U1", tier: "Upper Balcony", price: 1500, category: "SEATING" },
  { id: "BLOCK-U2", name: "Upper Tier U2", tier: "Upper Balcony", price: 1500, category: "SEATING" },
];

export default function SportsSeatBooking({ item: propItem, onBack, onProceed }) {
  const location = useLocation();
  const navigate = useNavigate();

  const item = propItem || location.state?.item || location.state?.event || {};
  const [ticketType, setTicketType] = useState("SEATING"); // "STANDING" | "SEATING" | "BEST AVAILABLE"
  const [selectedBlockId, setSelectedBlockId] = useState("BLOCK-B");
  const [quantity, setQuantity] = useState(1);

  const selectedBlock =
    STADIUM_BLOCKS.find((b) => b.id === selectedBlockId) || STADIUM_BLOCKS[1];
  const totalPrice = selectedBlock.price * quantity;

  // Filter list by tab
  const filteredBlocks = STADIUM_BLOCKS.filter((b) => {
    if (ticketType === "BEST AVAILABLE") return true;
    return b.category === ticketType;
  });

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleProceed = () => {
    const payload = {
      item,
      event: item,
      eventId: item?._id || item?.id,
      selectedSeats: Array.from(
        { length: quantity },
        (_, i) => `${selectedBlock.name}-Seat-${i + 1}`
      ),
      numberOfSeats: quantity,
      quantity,
      ticketPrice: selectedBlock.price,
      totalPrice,
      metadata: {
        block: selectedBlock.name,
        tier: selectedBlock.tier,
        category: ticketType,
      },
    };

    if (typeof onProceed === "function") {
      onProceed(payload);
    } else {
      navigate("/payment", { state: payload });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-zinc-100 py-8 px-4 sm:px-6 flex justify-center items-start font-sans">
      <div className="w-full max-w-5xl bg-[#0f1420] border border-zinc-800/90 rounded-[32px] p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6">
        
        {/* Top Title Section */}
        <div className="flex flex-col items-center justify-center text-center relative border-b border-zinc-800/80 pb-6">
          {onBack && (
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-0 top-0 p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400 flex items-center gap-1.5 mb-1.5">
            <Trophy className="w-3.5 h-3.5" /> STADIUM & ARENA SEATING
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            Select Ticket Type
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {item?.title || item?.name || "Premier Match / Arena Championship"} • {item?.location || "National Stadium Ground"}
          </p>

          {/* Ticket Type Segment Pills */}
          <div className="mt-5 flex items-center justify-center p-1 rounded-2xl bg-zinc-950/80 border border-zinc-800 max-w-md w-full">
            {[
              { id: "STANDING", label: "Standing", icon: Users },
              { id: "SEATING", label: "Seating", icon: Armchair },
              { id: "BEST AVAILABLE", label: "Best Available", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = ticketType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTicketType(tab.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {ticketType}
              </h2>
              <p className="text-xs text-zinc-400">
                Please select a block from the map or the table below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Quantity:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num} className="bg-zinc-900 text-white">
                  {num} {num > 1 ? "Tickets" : "Ticket"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Split Body: Left Table (5 cols) + Right Stadium SVG (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Blocks Table List */}
          <div className="lg:col-span-5 bg-[#0b0e17] border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-3 bg-zinc-950/80 border-b border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500">
              <span className="col-span-5">BLOCK</span>
              <span className="col-span-4 text-center">PRICE</span>
              <span className="col-span-3 text-right">ACTION</span>
            </div>

            {/* Scrollable Block Rows */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-800/50">
              {filteredBlocks.map((block) => {
                const isSelected = selectedBlockId === block.id;
                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`grid grid-cols-12 items-center px-4 py-3.5 transition cursor-pointer ${
                      isSelected
                        ? "bg-sky-500/10 border-l-4 border-sky-500"
                        : "hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="col-span-5">
                      <p className="text-xs font-bold text-white">{block.name}</p>
                      <p className="text-[10px] text-zinc-500">{block.tier}</p>
                    </div>

                    <div className="col-span-4 text-center font-mono font-bold text-xs text-sky-400">
                      ₹{block.price.toLocaleString("en-IN")}
                    </div>

                    <div className="col-span-3 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlockId(block.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
                          isSelected
                            ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Visual Stadium Map */}
          <div className="lg:col-span-7 bg-[#0b0e17] border border-zinc-800/80 rounded-3xl p-6 flex flex-col items-center justify-center relative select-none">
            
            <svg
              viewBox="0 0 600 360"
              className="w-full h-auto max-w-lg drop-shadow-2xl"
            >
              {/* Outer Stadium Perimeter Ring */}
              <rect
                x="20"
                y="15"
                width="560"
                height="330"
                rx="85"
                fill="#0d111a"
                stroke="#1f293d"
                strokeWidth="2"
              />

              {/* Top Peripheral Seating Blocks */}
              <g className="cursor-pointer">
                {["U9", "U8", "U7", "U6", "U5", "U4", "U3", "U2", "U1"].map((code, idx) => (
                  <rect
                    key={code}
                    x={120 + idx * 38}
                    y="25"
                    width="34"
                    height="20"
                    rx="4"
                    fill={selectedBlockId === "BLOCK-U1" && idx < 4 ? "#0284c7" : "#1a2233"}
                    stroke="#2a364f"
                    strokeWidth="1"
                    onClick={() => setSelectedBlockId("BLOCK-U1")}
                  />
                ))}
              </g>

              {/* Upper Main Stand Blocks (Includes Block B) */}
              <g className="cursor-pointer font-sans text-[10px] font-bold fill-zinc-400">
                <rect
                  x="140"
                  y="52"
                  width="45"
                  height="26"
                  rx="4"
                  fill={selectedBlockId === "BLOCK-A" ? "#0284c7" : "#1e283d"}
                  stroke="#334155"
                  onClick={() => setSelectedBlockId("BLOCK-A")}
                />
                <text x="156" y="68" fill="#94a3b8">A</text>

                {/* Block B: Active Accent Block */}
                <rect
                  x="195"
                  y="52"
                  width="55"
                  height="26"
                  rx="4"
                  fill={selectedBlockId === "BLOCK-B" ? "#0284c7" : "#0369a1"}
                  stroke="#38bdf8"
                  strokeWidth={selectedBlockId === "BLOCK-B" ? "2" : "1"}
                  className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] transition"
                  onClick={() => setSelectedBlockId("BLOCK-B")}
                />
                <text x="218" y="68" fill="#ffffff" fontWeight="bold">B</text>

                <rect
                  x="260"
                  y="52"
                  width="45"
                  height="26"
                  rx="4"
                  fill={selectedBlockId === "BLOCK-C" ? "#0284c7" : "#1e283d"}
                  stroke="#334155"
                  onClick={() => setSelectedBlockId("BLOCK-C")}
                />
                <text x="276" y="68" fill="#94a3b8">C</text>

                <rect
                  x="315"
                  y="52"
                  width="45"
                  height="26"
                  rx="4"
                  fill={selectedBlockId === "BLOCK-D" ? "#0284c7" : "#1e283d"}
                  stroke="#334155"
                  onClick={() => setSelectedBlockId("BLOCK-D")}
                />
                <text x="331" y="68" fill="#94a3b8">D</text>
              </g>

              {/* Stage / West End Box */}
              <rect
                x="80"
                y="110"
                width="40"
                height="140"
                rx="6"
                fill="#271c36"
                stroke="#6b21a8"
                strokeWidth="1.5"
              />
              <text
                x="-195"
                y="105"
                transform="rotate(-90)"
                fill="#d8b4fe"
                fontSize="11"
                fontWeight="900"
                letterSpacing="3"
              >
                STAGE / TEAM
              </text>

              {/* Golden Circle Area */}
              <polygon
                points="140,110 205,120 205,240 140,250"
                fill={selectedBlockId === "GOLDEN-CIRCLE" ? "#d97706" : "#452e18"}
                stroke="#b45309"
                strokeWidth="1.5"
                className="cursor-pointer transition"
                onClick={() => setSelectedBlockId("GOLDEN-CIRCLE")}
              />
              <text
                x="146"
                y="185"
                fill="#fde68a"
                fontSize="9"
                fontWeight="bold"
                className="pointer-events-none"
              >
                GOLDEN CIRCLE
              </text>

              {/* Central Pitch / Standing Field */}
              <rect
                x="220"
                y="110"
                width="280"
                height="140"
                rx="8"
                fill={selectedBlockId === "STANDING-LAWN" ? "#059669" : "#0d3926"}
                stroke="#10b981"
                strokeWidth="1.5"
                className="cursor-pointer transition"
                onClick={() => setSelectedBlockId("STANDING-LAWN")}
              />
              <text
                x="320"
                y="185"
                fill="#6ee7b7"
                fontSize="12"
                fontWeight="900"
                letterSpacing="2"
                className="pointer-events-none"
              >
                STANDING PITCH
              </text>

              {/* Right Perimeter Lower Blocks (27 - 33) */}
              <g className="cursor-pointer">
                {[27, 28, 29, 30, 31, 32, 33].map((bNum, i) => (
                  <rect
                    key={bNum}
                    x="515"
                    y={105 + i * 22}
                    width="45"
                    height="18"
                    rx="3"
                    fill="#152438"
                    stroke="#1e3a5f"
                    onClick={() => setSelectedBlockId("BLOCK-C")}
                  />
                ))}
              </g>

              {/* Bottom Grandstand Blocks (15 - 25) */}
              <g className="cursor-pointer">
                {[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map((bNum, i) => (
                  <rect
                    key={bNum}
                    x={90 + i * 38}
                    y="280"
                    width="34"
                    height="28"
                    rx="4"
                    fill={i > 4 ? "#152438" : "#1a2233"}
                    stroke="#2a364f"
                    onClick={() => setSelectedBlockId(i > 4 ? "BLOCK-C" : "BLOCK-A")}
                  />
                ))}
              </g>
            </svg>

            {/* Stadium Legend Indicator */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-zinc-800/80 w-full text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-500" />
                <span>Selected Block</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0d3926] border border-emerald-500" />
                <span>Standing Pitch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#452e18] border border-amber-600" />
                <span>Golden Circle</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Booking Summary Footer */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block">
              Total ({quantity}x {selectedBlock.name}):
            </span>
            <span className="text-2xl font-black text-white tracking-tight">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="px-8 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 active:scale-95 transition cursor-pointer flex items-center gap-2"
          >
            <span>Confirm Block Reservation</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}