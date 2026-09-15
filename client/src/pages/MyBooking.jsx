import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Trash2,
  CalendarDays,
  Ticket,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  QrCode,
} from "lucide-react";

// Local static image assets
import concert from "../assets/concert.jpg";
import tech from "../assets/tech.jpg";
import food from "../assets/food.jpg";
import football from "../assets/football.jpg";
import singer from "../assets/singer.jpg";
import swim from "../assets/swim.jpg";
import art from "../assets/art.jpg";
import plane from "../assets/plane.jpg";
import indigo from "../assets/indigo.jpg";
import emirates from "../assets/emirates.jpg";
import bus1 from "../assets/bus1.jpg";
import bus2 from "../assets/bus2.jpg";
import train1 from "../assets/train1.jpg";
import train2 from "../assets/train2.jpg";
import train3 from "../assets/train3.jpg";
import bus3 from "../assets/bus3.jpg";
import tennis from "../assets/tennis.jpg";
import movie1 from "../assets/movie1.jpg";
import movie2 from "../assets/movie2.jpg";

const localImageMap = {
  concert, tech, food, football, singer, swim, art,
  plane, indigo, emirates, bus1, bus2, train1, train2,
  train3, bus3, tennis, movie1, movie2,
};

const DEFAULT_TRAIN_IMAGE =
  "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80";
const DEFAULT_FLIGHT_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80";
const DEFAULT_BUS_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80";

const resolveTicketImage = (booking) => {
  const evt = booking?.eventId || booking?.event || {};
  const title = String(evt.title || evt.name || booking?.title || booking?.name || "").toLowerCase();
  const category = String(evt.category || booking?.category || "").toLowerCase();
  const rawImg = evt.image || evt.imageUrl || booking?.image || booking?.imageUrl;

  // 1. Force Train Match
  if (
    title.includes("express") ||
    title.includes("train") ||
    title.includes("rail") ||
    category.includes("train") ||
    category.includes("rail")
  ) {
    return train1 || train2 || train3 || DEFAULT_TRAIN_IMAGE;
  }

  // 2. Force Flight Match
  if (
    title.includes("flight") ||
    title.includes("indigo") ||
    title.includes("air") ||
    title.includes("emirates") ||
    category.includes("flight")
  ) {
    return indigo || plane || emirates || DEFAULT_FLIGHT_IMAGE;
  }

  // 3. Force Bus Match
  if (title.includes("bus") || category.includes("bus") || category.includes("coach")) {
    return bus1 || bus2 || bus3 || DEFAULT_BUS_IMAGE;
  }

  // 4. Force Sports Match
  if (
    title.includes("match") ||
    title.includes("football") ||
    title.includes("cricket") ||
    category.includes("sport")
  ) {
    return football || tennis;
  }

  // 5. Explicit local asset key matches
  if (rawImg && localImageMap[rawImg]) return localImageMap[rawImg];

  if (typeof rawImg === "string") {
    const cleanKey = rawImg.replace(/\.[^/.]+$/, "").trim();
    if (localImageMap[cleanKey]) return localImageMap[cleanKey];

    if (rawImg.includes("photo-1501281668745-f7f57925c3b4")) {
      return train1 || DEFAULT_TRAIN_IMAGE;
    }

    if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
      return rawImg;
    }

    if (rawImg.includes("uploads") || rawImg.startsWith("/")) {
      const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const cleanPath = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
      return `${rawBase}${cleanPath}`;
    }
  }

  return train1 || DEFAULT_TRAIN_IMAGE;
};

export default function MyBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const baseUrl = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token") ||
          localStorage.getItem("authToken");

        const userRaw = localStorage.getItem("user") || sessionStorage.getItem("user");
        let currentUser = {};
        try {
          currentUser = JSON.parse(userRaw || "{}");
        } catch {
          currentUser = {};
        }

        const userId = currentUser._id || currentUser.id;
        const url = userId
          ? `${baseUrl}/bookings?userId=${userId}`
          : `${baseUrl}/bookings`;

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          throw new Error("Unable to fetch your booking wallet.");
        }

        const data = await res.json();
        const bookingList = Array.isArray(data) ? data : data?.bookings || [];

        const newBooking = location.state?.booking;
        let finalBookings = [...bookingList];

        if (newBooking) {
          const exists = finalBookings.some(
            (b) => (b._id || b.id) === (newBooking._id || newBooking.id)
          );
          if (!exists) {
            finalBookings.unshift(newBooking);
          }
        }

        setBookings(finalBookings);

        if (finalBookings.length > 0) {
          setSelectedBookingId(finalBookings[0]._id || finalBookings[0].id);
        }
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError(err.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [baseUrl, location.state]);

  const activeBooking = useMemo(() => {
    if (!bookings.length) return null;
    return (
      bookings.find((b) => (b._id || b.id) === selectedBookingId) ||
      bookings[0]
    );
  }, [bookings, selectedBookingId]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This will restore seats.")) {
      return;
    }

    try {
      setActionLoading(true);
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const res = await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel booking.");
      }

      setBookings((prev) =>
        prev.map((b) =>
          (b._id || b.id) === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking has been cancelled and seats have been restored.");
    } catch (err) {
      alert(err.message || "Could not cancel booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const activeTicketsCount = bookings.filter((b) => b.status !== "cancelled").length;

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-zinc-100 font-sans py-8 sm:py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800/80">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Your Ticket Wallet
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage, reschedule, or cancel your active booking stubs securely.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl bg-[#0f1420] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeTicketsCount} Active Ticket{activeTicketsCount === 1 ? "" : "s"}</span>
            </span>
          </div>
        </div>

        {/* Status Indicators */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Loading wallet stubs...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <div className="py-24 text-center bg-[#0f1420] border border-zinc-800/90 rounded-3xl max-w-lg mx-auto p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mx-auto mb-4">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Tickets in Wallet</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              You haven't reserved any flights, trains, buses, or event seats yet.
            </p>
            <button
              type="button"
              onClick={() => navigate("/browse")}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-sky-500/25 cursor-pointer"
            >
              Browse Destinations
            </button>
          </div>
        )}

        {/* Split Grid */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
            
            {/* Left Column: Dark Ticket Cards */}
            <div className="flex flex-col gap-5">
              {bookings.map((booking) => {
                const bId = booking._id || booking.id;
                const isSelected = (activeBooking?._id || activeBooking?.id) === bId;
                const isCancelled = booking.status === "cancelled";
                const evt = booking.eventId || booking.event || {};
                const ticketTitle = evt.title || evt.name || booking.title || booking.name || "New York Express";
                const ticketLocation = evt.location || evt.route || (evt.from && evt.to ? `${evt.from} to ${evt.to}` : "New York to Boston");
                const ticketDate = evt.date || booking.date || "2027-1-30";
                const seats = booking.selectedSeats || [];

                return (
                  <div
                    key={bId}
                    onClick={() => setSelectedBookingId(bId)}
                    className={`rounded-3xl p-6 bg-[#0f1420] border transition-all duration-200 cursor-pointer shadow-xl ${
                      isSelected
                        ? "border-sky-500/80 ring-1 ring-sky-500/40 shadow-sky-500/10 bg-[#121929]"
                        : "border-zinc-850 hover:border-zinc-700 bg-[#0f1420]"
                    } ${isCancelled ? "opacity-50 grayscale-[50%]" : ""}`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-xl bg-[#07090e] border border-zinc-800 text-[11px] font-mono text-sky-400 font-bold">
                        {bId}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isCancelled
                              ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                              : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          }`}
                        >
                          {isCancelled ? "CANCELLED" : "CONFIRMED"}
                        </span>

                        {!isCancelled && (
                          <button
                            type="button"
                            title="Cancel Booking"
                            disabled={actionLoading}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(bId);
                            }}
                            className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-4 mb-5">
                      <img
                        src={resolveTicketImage(booking)}
                        alt={ticketTitle}
                        className="w-16 h-16 rounded-2xl object-cover border border-zinc-800 shrink-0 bg-[#07090e] shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = train1 || DEFAULT_TRAIN_IMAGE;
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-black text-white truncate">
                          {ticketTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                            <span className="truncate">{ticketLocation}</span>
                          </span>

                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span>{ticketDate}</span>
                          </span>
                        </div>

                        {seats.length > 0 && (
                          <p className="text-xs text-sky-400 font-bold mt-1 font-mono">
                            Seats: {seats.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-zinc-800/80">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookingId(bId);
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>

                      {!isCancelled && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Reschedule request opened. Please select a new date.");
                            }}
                            className="py-2.5 px-4 rounded-xl bg-[#0b0e17] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CalendarDays className="w-3.5 h-3.5 text-sky-400" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(bId);
                            }}
                            className="py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Dark Pass Wallet Stub */}
            {activeBooking && (
              <div className="sticky top-20 rounded-[32px] overflow-hidden bg-[#0f1420] border border-zinc-800/90 shadow-2xl flex flex-col">
                
                {/* Header */}
                <div className="bg-[#0b101b] p-6 text-center border-b border-zinc-800/80">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400 block mb-1">
                    PASS WALLET STUB
                  </span>
                  <h2 className="text-xl font-black text-white">
                    {activeBooking.eventId?.title || activeBooking.title || "New York Express"}
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {activeBooking.eventId?.date || activeBooking.date || "2027-1-30"}
                  </p>
                </div>

                {/* Dark QR Code Section */}
                <div className="p-8 flex flex-col items-center justify-center bg-[#07090e] border-b border-dashed border-zinc-800">
                  <div className="p-3.5 bg-white rounded-2xl shadow-xl border border-zinc-700">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        activeBooking._id || activeBooking.id || "FLEXIBOOK-TICKET"
                      )}`}
                      alt="Booking QR Code"
                      className="w-44 h-44 object-contain"
                    />
                  </div>

                  <span className="mt-4 font-mono font-black text-xs tracking-wider text-sky-400 select-all bg-[#0f1420] px-3.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm">
                    {activeBooking._id || activeBooking.id}
                  </span>
                </div>

                {/* Info List */}
                <div className="p-6 bg-[#0f1420] divide-y divide-zinc-800/60 text-xs">
                  <div className="flex justify-between py-2.5">
                    <span className="text-zinc-400">Holder</span>
                    <span className="font-bold text-white">
                      {activeBooking.customerName || "admin"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2.5">
                    <span className="text-zinc-400">Email</span>
                    <span className="font-bold text-white truncate max-w-[180px]">
                      {activeBooking.customerEmail || "admin@flexibook.com"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2.5">
                    <span className="text-zinc-400">Seats</span>
                    <span className="font-mono font-bold text-sky-400">
                      {activeBooking.selectedSeats?.length
                        ? activeBooking.selectedSeats.join(", ")
                        : activeBooking.numberOfSeats || 1}
                    </span>
                  </div>

                  <div className="flex justify-between py-2.5">
                    <span className="text-zinc-400">Total Paid</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-sm">
                      ₹{Number(activeBooking.totalPrice || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Verification Bar */}
                <div className="p-3 bg-[#07090e] text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 border-t border-zinc-800/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FlexiBook Cryptographic Ledger Pass</span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}