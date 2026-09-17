import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Download,
  ArrowLeft,
  X,
  Printer,
  Trash2,
  CalendarClock,
  Ban,
  Ticket,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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

  if (
    title.includes("express") ||
    title.includes("train") ||
    title.includes("rail") ||
    category.includes("train") ||
    category.includes("rail")
  ) {
    return train1 || train2 || train3 || DEFAULT_TRAIN_IMAGE;
  }

  if (
    title.includes("flight") ||
    title.includes("indigo") ||
    title.includes("air") ||
    title.includes("emirates") ||
    category.includes("flight")
  ) {
    return indigo || plane || emirates || DEFAULT_FLIGHT_IMAGE;
  }

  if (title.includes("bus") || category.includes("bus") || category.includes("coach")) {
    return bus1 || bus2 || bus3 || DEFAULT_BUS_IMAGE;
  }

  if (
    title.includes("match") ||
    title.includes("football") ||
    title.includes("cricket") ||
    category.includes("sport")
  ) {
    return football || tennis;
  }

  if (rawImg && localImageMap[rawImg]) return localImageMap[rawImg];

  if (typeof rawImg === "string") {
    const cleanKey = rawImg.replace(/\.[^/.]+$/, "").trim();
    if (localImageMap[cleanKey]) return localImageMap[cleanKey];

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

// --- Digital Boarding Pass Modal ---
const DigitalTicketModal = ({ ticket, isOpen, onClose, isDarkMode }) => {
  if (!isOpen || !ticket) return null;

  const event = ticket.eventId || {};
  const name = ticket.customerName || "Guest Passenger";
  const destination = event.location || event.to || "Destination";
  const origin = event.from || "Origin";
  const title = event.title || "Ticket Reservation";
  const bookingId = ticket._id || "BKG-000000";
  const seats = ticket.selectedSeats?.length
    ? ticket.selectedSeats.join(", ")
    : `${ticket.numberOfSeats || 1} Seat(s)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-3xl my-auto">
        {/* Modal Controls */}
        <div className="w-full flex justify-between items-center mb-3">
          <span
            className={`font-semibold text-xs uppercase tracking-wider ${
              isDarkMode ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            Digital Ticket Confirmation
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 shadow-sm"
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 shadow-sm"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Card */}
        <div
          className={`w-full rounded-2xl overflow-hidden border shadow-2xl flex flex-col sm:flex-row relative min-h-[340px] ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          {/* Left / Top Accent Ribbon */}
          <div className="h-12 sm:h-auto sm:w-16 bg-zinc-950 flex sm:flex-col justify-between items-center p-4 select-none text-white shrink-0 border-b sm:border-b-0 sm:border-r border-zinc-800">
            <span className="font-semibold text-xs sm:text-sm tracking-widest sm:[writing-mode:vertical-rl] sm:rotate-180 uppercase">
              FlexiBook
            </span>
            <span className="font-medium text-[10px] text-zinc-400 tracking-wider sm:[writing-mode:vertical-rl] sm:rotate-180 uppercase">
              Boarding Pass
            </span>
          </div>

          {/* Ticket Body */}
          <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Passenger Name
                </p>
                <p className="text-base font-semibold mt-0.5 truncate uppercase">
                  {name}
                </p>
              </div>

              <div className="sm:col-span-7 flex items-center gap-3">
                <div className="truncate">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                    From
                  </p>
                  <p className="text-sm font-semibold mt-0.5 truncate uppercase">
                    {origin}
                  </p>
                </div>

                <span className="text-xs text-zinc-400 px-1 pt-3">→</span>

                <div className="truncate">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                    To
                  </p>
                  <p className="text-sm font-semibold mt-0.5 truncate uppercase">
                    {destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Event details row */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t ${
                isDarkMode ? "border-zinc-800" : "border-zinc-100"
              }`}
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Event / Trip
                </p>
                <p className="text-xs sm:text-sm font-semibold mt-0.5 truncate">
                  {title}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Date
                </p>
                <p className="text-xs sm:text-sm font-semibold mt-0.5 whitespace-nowrap">
                  {event.date || "Scheduled"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Email
                </p>
                <p className="text-xs sm:text-sm font-semibold mt-0.5 truncate">
                  {ticket.customerEmail}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Seats
                </p>
                <p className="text-xs sm:text-sm font-semibold font-mono mt-0.5">
                  {seats}
                </p>
              </div>
            </div>

            {/* Bottom ID and barcode row */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-4 border-t ${
                isDarkMode ? "border-zinc-800" : "border-zinc-100"
              }`}
            >
              <div className="sm:col-span-5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Booking Reference
                </p>
                <p className="text-xs font-mono font-semibold mt-0.5 truncate">
                  {bookingId}
                </p>
              </div>

              <div className="sm:col-span-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Status
                </p>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${
                    ticket.status === "cancelled" ? "text-rose-500" : "text-emerald-500"
                  }`}
                >
                  {ticket.status}
                </p>
              </div>

              <div className="sm:col-span-4 flex sm:justify-end">
                <div
                  className={`flex items-end gap-[2px] h-9 p-1 rounded ${
                    isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
                  }`}
                >
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2].map((w, i) => (
                    <span
                      key={i}
                      className={`h-full inline-block ${
                        isDarkMode ? "bg-zinc-300" : "bg-zinc-800"
                      }`}
                      style={{ width: `${w * 1.2}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reschedule Modal ---
const RescheduleModal = ({ isOpen, onClose, ticket, onConfirm, isDarkMode }) => {
  const [newDate, setNewDate] = useState("");

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) return;
    onConfirm(ticket._id, newDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className={`rounded-2xl p-6 w-full max-w-sm border shadow-2xl transition-colors ${
          isDarkMode
            ? "bg-zinc-900 border-zinc-800 text-zinc-100"
            : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-base">Reschedule Booking</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          Select a new date and time for {ticket.eventId?.title || "your booking"}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              New Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none transition-colors ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                  : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-500"
              }`}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                isDarkMode
                  ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-95 ${
                isDarkMode
                  ? "bg-white text-zinc-950 hover:bg-zinc-200"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
              }`}
            >
              Save Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const MyBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [modalTicket, setModalTicket] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [activeStub, setActiveStub] = useState(null);
  const [loading, setLoading] = useState(true);

  const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const baseUrl = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setBookings([]);
        setActiveStub(null);

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
        const userEmail =
          currentUser.email ||
          localStorage.getItem("userEmail") ||
          sessionStorage.getItem("userEmail");

        if (!userId && !userEmail) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const queryParams = new URLSearchParams();
        if (userId) queryParams.append("userId", userId);
        if (userEmail) queryParams.append("email", userEmail);

        const response = await fetch(`${baseUrl}/bookings?${queryParams.toString()}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        const bookingList = Array.isArray(data) ? data : data?.bookings || [];

        setBookings(bookingList);
        if (bookingList.length > 0) {
          setActiveStub(bookingList[0]);
        }
      } catch (err) {
        console.error("Error loading wallet bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [baseUrl, location.key]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${id}?`)) return;

    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const response = await fetch(`${baseUrl}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const updatedItem = await response.json();
      if (!response.ok) throw new Error(updatedItem.message || "Failed to cancel booking");

      const updatedList = bookings.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b));
      setBookings(updatedList);
      if (activeStub?._id === id) setActiveStub((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmReschedule = async (id, newDateStr) => {
    const formattedDate = new Date(newDateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const response = await fetch(`${baseUrl}/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ date: formattedDate }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Failed to reschedule date");

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, date: formattedDate } : b))
      );
      if (activeStub?._id === id) {
        setActiveStub((prev) => ({ ...prev, date: formattedDate }));
      }
    } catch (err) {
      alert("Failed to reschedule date: " + err.message);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking record?")) return;

    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const response = await fetch(`${baseUrl}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to delete booking");
      }

      const updatedList = bookings.filter((b) => (b._id || b.id) !== id);
      setBookings(updatedList);
      if ((activeStub?._id || activeStub?.id) === id) {
        setActiveStub(updatedList[0] || null);
      }
    } catch (err) {
      alert(err.message || "Failed to delete booking");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center gap-3 transition-colors ${
          isDarkMode ? "bg-zinc-950 text-zinc-400" : "bg-zinc-50 text-zinc-600"
        }`}
      >
        <div className="w-7 h-7 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase font-medium tracking-wider">
          Loading ticket wallet...
        </span>
      </div>
    );
  }

  const activeCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div
      className={`min-h-screen font-sans py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 select-none ${
        isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <main className="max-w-6xl mx-auto">
        {/* Header Bar */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b ${
            isDarkMode ? "border-zinc-800" : "border-zinc-200"
          }`}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Your ticket wallet
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
              Review and manage your active reservations and boarding passes.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-medium border transition cursor-pointer ${
                isDarkMode
                  ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200"
                  : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-800 shadow-sm"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {activeCount} Active Ticket{activeCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Cards List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {bookings.length === 0 ? (
              <div
                className={`rounded-2xl p-10 sm:p-12 text-center border ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <Ticket className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm font-medium">
                  No tickets found in your wallet.
                </p>
              </div>
            ) : (
              bookings.map((item) => {
                const isSelected = activeStub?._id === item._id;
                const isCancelled = item.status === "cancelled";
                const event = item.eventId || {};
                const seats = item.selectedSeats || [];

                return (
                  <div
                    key={item._id}
                    onClick={() => setActiveStub(item)}
                    className={`rounded-2xl p-5 relative overflow-hidden transition cursor-pointer border ${
                      isSelected
                        ? isDarkMode
                          ? "bg-zinc-900 border-zinc-600 shadow-lg ring-1 ring-zinc-700"
                          : "bg-white border-zinc-400 shadow-md ring-1 ring-zinc-300"
                        : isDarkMode
                        ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
                    } ${isCancelled ? "opacity-55" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-lg border ${
                          isDarkMode
                            ? "bg-zinc-950 border-zinc-800 text-zinc-400"
                            : "bg-zinc-100 border-zinc-200 text-zinc-700"
                        }`}
                      >
                        {item._id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                            isCancelled
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item._id);
                          }}
                          className="text-zinc-400 hover:text-rose-500 p-1 transition cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 my-2">
                      <img
                        src={resolveTicketImage(item)}
                        alt={event.title || "Event thumbnail"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = train1 || DEFAULT_TRAIN_IMAGE;
                        }}
                        className={`w-16 h-16 rounded-xl object-cover shrink-0 border ${
                          isDarkMode ? "border-zinc-800" : "border-zinc-200"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-semibold truncate">
                          {event.title || item.title || "Trip reservation"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                            {event.location || (event.from && event.to ? `${event.from} to ${event.to}` : "Standard route")}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                            {event.date || "Scheduled"}
                          </span>
                        </div>
                        {seats.length > 0 && (
                          <p className="text-xs font-mono font-medium mt-1">
                            Seats: {seats.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`mt-4 pt-3 border-t flex flex-col sm:flex-row items-center gap-2 ${
                        isDarkMode ? "border-zinc-800" : "border-zinc-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalTicket(item);
                        }}
                        className={`w-full sm:flex-1 py-2 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isDarkMode
                            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>

                      {!isCancelled && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRescheduleTarget(item);
                            }}
                            className={`w-full sm:w-auto py-2 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                              isDarkMode
                                ? "bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300"
                                : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700 shadow-sm"
                            }`}
                          >
                            <CalendarClock className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(item._id);
                            }}
                            className="w-full sm:w-auto py-2 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Ticket Preview Column */}
          {activeStub && (
            <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
              <div
                className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border flex flex-col transition-colors ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-zinc-200"
                }`}
              >
                <div
                  className={`text-center py-5 px-4 border-b ${
                    isDarkMode
                      ? "bg-zinc-950 border-zinc-800"
                      : "bg-zinc-100 border-zinc-200"
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Selected Stub
                  </p>
                  <h3 className="text-lg font-semibold mt-0.5">
                    {activeStub.eventId?.title || "Reservation Stub"}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {activeStub.eventId?.date || "Scheduled"}
                  </p>
                </div>

                <div
                  className={`flex flex-col items-center justify-center p-6 border-b border-dashed ${
                    isDarkMode ? "border-zinc-800" : "border-zinc-200"
                  }`}
                >
                  <div className="bg-white p-3 rounded-xl shadow-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                        activeStub._id
                      )}`}
                      alt="Gate Scanner QR"
                      className="w-32 h-32"
                    />
                  </div>
                  <span
                    className={`mt-3 font-mono font-medium text-xs px-3 py-1 rounded-lg border select-all ${
                      isDarkMode
                        ? "bg-zinc-950 border-zinc-800 text-zinc-300"
                        : "bg-zinc-100 border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {activeStub._id}
                  </span>
                </div>

                <div
                  className={`p-5 divide-y text-xs ${
                    isDarkMode ? "divide-zinc-800" : "divide-zinc-100"
                  }`}
                >
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">Holder</span>
                    <span className="font-medium">{activeStub.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">Email</span>
                    <span className="font-medium truncate max-w-[160px]">
                      {activeStub.customerEmail}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">Seats</span>
                    <span className="font-mono font-medium">
                      {activeStub.selectedSeats?.length
                        ? activeStub.selectedSeats.join(", ")
                        : activeStub.numberOfSeats || 1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">Status</span>
                    <span
                      className={`font-semibold uppercase tracking-wider ${
                        activeStub.status === "cancelled"
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {activeStub.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">Total Paid</span>
                    <span className="font-mono font-semibold text-sm">
                      ₹{activeStub.totalPrice}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3 text-center text-[10px] text-zinc-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 border-t ${
                    isDarkMode
                      ? "bg-zinc-950 border-zinc-800"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Verified flexibook pass</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Render Pass Modal */}
      <DigitalTicketModal
        ticket={modalTicket}
        isOpen={Boolean(modalTicket)}
        onClose={() => setModalTicket(null)}
        isDarkMode={isDarkMode}
      />

      {/* Render Reschedule Modal */}
      <RescheduleModal
        isOpen={Boolean(rescheduleTarget)}
        ticket={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirm={handleConfirmReschedule}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default MyBookingPage;