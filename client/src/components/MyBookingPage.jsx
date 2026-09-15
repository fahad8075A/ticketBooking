import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaDownload, 
  FaArrowLeft, 
  FaTimes, 
  FaPrint, 
  FaTrashAlt, 
  FaCalendarCheck,
  FaBan
} from "react-icons/fa";
import { Ticket, ShieldCheck, CheckCircle2 } from "lucide-react";

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

// --- Digital Boarding Pass Modal ---
const DigitalTicketModal = ({ ticket, isOpen, onClose }) => {
  if (!isOpen || !ticket) return null;

  const event = ticket.eventId || {};
  const name = ticket.customerName || "GUEST PASSENGER";
  const destination = event.location || event.to || "COCHIN";
  const origin = event.from || "ORIGIN";
  const title = event.title || "EXPRESS ENTRY";
  const bookingId = ticket._id || "TRN-826491";
  const seats = ticket.selectedSeats?.length ? ticket.selectedSeats.join(", ") : `${ticket.numberOfSeats || 1} Seat(s)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-[920px]">
        {/* Modal Controls */}
        <div className="w-full flex justify-between items-center mb-3 text-white">
          <span className="font-bold text-sm tracking-wide text-sky-400">
            Digital Pass Preview
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#0f1420] hover:bg-zinc-800 border border-zinc-700 text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer text-zinc-200"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={onClose}
              className="bg-[#0f1420] hover:bg-zinc-800 border border-zinc-700 p-2 rounded-full text-sm transition cursor-pointer text-zinc-300"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Boarding Pass Container */}
        <div className="w-full bg-[#0f1420] rounded-[26px] shadow-2xl overflow-hidden flex flex-row relative min-h-[380px] border border-zinc-800">
          {/* Left Ribbon */}
          <div className="w-14 sm:w-20 bg-gradient-to-b from-sky-600 via-blue-700 to-sky-900 flex flex-col justify-between items-center py-8 select-none text-white shrink-0">
            <span className="font-black text-xs sm:text-base tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
              FLEXIBOOK
            </span>
            <span className="font-bold text-[10px] sm:text-xs tracking-[0.2em] text-sky-200 [writing-mode:vertical-rl] rotate-180 uppercase">
              Digital Pass
            </span>
          </div>

          {/* Ticket Body */}
          <div className="flex-1 bg-[#0b0e17] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-zinc-200">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Name of Passenger
                </p>
                <p className="text-base sm:text-lg font-black text-white mt-0.5 uppercase truncate">
                  {name}
                </p>
              </div>

              <div className="col-span-7 flex items-center gap-2 sm:gap-3">
                <div className="truncate">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    From
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5 uppercase truncate">
                    {origin}
                  </p>
                </div>

                <div className="text-sky-400 text-xs font-mono select-none pt-3">
                  ➔
                </div>

                <div className="truncate">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    To
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5 uppercase truncate">
                    {destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Event Details */}
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Trip / Title
                </p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                  {title}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Date
                </p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 whitespace-nowrap">
                  {event.date || "Scheduled"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                  {ticket.customerEmail}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Seats
                </p>
                <p className="text-xs sm:text-sm font-bold text-sky-400 mt-0.5 font-mono">
                  {seats}
                </p>
              </div>
            </div>

            {/* Row 3: Barcode & Info */}
            <div className="grid grid-cols-12 gap-4 items-end pt-4 border-t border-zinc-800/80">
              <div className="col-span-4">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Booking ID
                </p>
                <p className="text-xs sm:text-sm font-bold text-sky-400 mt-0.5 font-mono truncate">
                  {bookingId}
                </p>
              </div>

              <div className="col-span-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Status
                </p>
                <p className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5 uppercase tracking-wide">
                  {ticket.status}
                </p>
              </div>

              <div className="col-span-5 flex justify-end">
                <div className="flex items-end gap-[3px] h-11 bg-white/5 p-1 rounded-lg">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2].map(
                    (w, i) => (
                      <span
                        key={i}
                        className="bg-zinc-200 h-full inline-block"
                        style={{ width: `${w * 1.3}px` }}
                      />
                    )
                  )}
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
const RescheduleModal = ({ isOpen, onClose, ticket, onConfirm }) => {
  const [newDate, setNewDate] = useState("");

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) return;
    onConfirm(ticket._id, newDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0f1420] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-zinc-800 text-zinc-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white text-base">Reschedule Booking</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
            <FaTimes />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          Select a new date for <b className="text-white">{ticket.eventId?.title}</b> ({ticket._id}).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
              Select New Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-[#07090e] border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-sky-500 hover:bg-sky-400 text-white py-2 rounded-xl text-xs font-bold transition shadow-md shadow-sky-500/20 cursor-pointer"
            >
              Save New Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Component ---
const MyBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        // Clear previous user's booking list so it never bleeds across accounts
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
        const userEmail = currentUser.email || localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

        // If no authenticated identity exists, exit cleanly without requesting
        if (!userId && !userEmail) {
          setBookings([]);
          setLoading(false);
          return;
        }

        // Build query to scope data strictly to this account
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
  }, [baseUrl, location.key]); // Re-runs immediately when navigating or logging in as another user

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
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center gap-3 text-zinc-400">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase font-bold tracking-wider">Loading ticket wallet...</span>
      </div>
    );
  }

  const activeCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans py-8 sm:py-12 px-4 sm:px-8">
      <main className="max-w-[1240px] mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-zinc-800/80">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your Ticket Wallet
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
              Manage, reschedule, or cancel your active booking stubs securely.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 bg-[#0f1420] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs px-4 py-2 rounded-xl font-bold transition cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" /> Back
            </button>
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeCount} Active Ticket{activeCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cards Column */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {bookings.length === 0 ? (
              <div className="bg-[#0f1420] rounded-3xl p-12 text-center border border-zinc-800">
                <Ticket className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm font-semibold">No tickets found in your wallet.</p>
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
                    className={`rounded-3xl p-6 relative overflow-hidden transition cursor-pointer border ${
                      isSelected
                        ? "bg-[#121929] border-sky-500/80 ring-1 ring-sky-500/40 shadow-xl"
                        : "bg-[#0f1420] border-zinc-800/90 hover:border-zinc-700"
                    } ${isCancelled ? "opacity-50 grayscale-[50%]" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-[#07090e] text-sky-400 border border-zinc-800 text-[11px] font-bold px-3 py-1 rounded-xl font-mono tracking-wider">
                        {item._id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider border ${
                            isCancelled
                              ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                              : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          }`}
                        >
                          {item.status}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item._id);
                          }}
                          className="text-zinc-600 hover:text-rose-400 p-1 transition cursor-pointer"
                          title="Delete record"
                        >
                          <FaTrashAlt className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 my-3">
                      <img
                        src={resolveTicketImage(item)}
                        alt={event.title || "Event Image"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = train1 || DEFAULT_TRAIN_IMAGE;
                        }}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-zinc-800 bg-[#07090e] shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-black text-white truncate">
                          {event.title || item.title || "New York Express"}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-sky-400 text-[10px]" />
                            {event.location || (event.from && event.to ? `${event.from} to ${event.to}` : "New York to Boston")}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <FaCalendarAlt className="text-zinc-500 text-[10px]" />
                            {event.date || "Scheduled"}
                          </span>
                        </div>
                        {seats.length > 0 && (
                          <p className="text-xs text-sky-400 font-bold mt-1 font-mono">
                            Seats: {seats.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalTicket(item);
                        }}
                        className="w-full sm:flex-1 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <FaDownload className="text-[10px]" /> View Pass
                      </button>

                      {!isCancelled && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRescheduleTarget(item);
                            }}
                            className="w-full sm:w-auto bg-[#0b0e17] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <FaCalendarCheck className="text-[10px] text-sky-400" /> Reschedule
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(item._id);
                            }}
                            className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <FaBan className="text-[10px]" /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Pass Wallet Stub Column */}
          {activeStub && (
            <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
              <div className="w-full max-w-[390px] bg-[#0f1420] rounded-[32px] shadow-2xl overflow-hidden border border-zinc-800 flex flex-col">
                <div className="bg-[#0b101b] text-white text-center py-6 px-4 border-b border-zinc-800">
                  <p className="text-[10px] font-black text-sky-400 tracking-[0.25em] uppercase">
                    Pass Wallet Stub
                  </p>
                  <h3 className="text-xl font-black mt-1">
                    {activeStub.eventId?.title || "New York Express"}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {activeStub.eventId?.date || "2027-1-30"}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-[#07090e] border-b border-dashed border-zinc-800">
                  <div className="bg-white p-3 border border-zinc-700 rounded-2xl shadow-xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        activeStub._id
                      )}`}
                      alt="Gate Scanner QR"
                      className="w-36 h-36"
                    />
                  </div>
                  <span className="mt-4 font-mono font-black text-xs tracking-wider text-sky-400 select-all bg-[#0f1420] px-3.5 py-1.5 rounded-xl border border-zinc-800 shadow-sm">
                    {activeStub._id}
                  </span>
                </div>

                <div className="p-6 bg-[#0f1420] divide-y divide-zinc-800/60 text-xs">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-zinc-400">Holder</span>
                    <span className="font-bold text-white">{activeStub.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-zinc-400">Email</span>
                    <span className="font-bold text-white truncate max-w-[170px]">{activeStub.customerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-zinc-400">Seats</span>
                    <span className="font-mono font-bold text-sky-400">
                      {activeStub.selectedSeats?.length ? activeStub.selectedSeats.join(", ") : activeStub.numberOfSeats || 1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-zinc-400">Status</span>
                    <span className={`font-black uppercase tracking-wider ${activeStub.status === 'cancelled' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {activeStub.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-zinc-400">Total Paid</span>
                    <span className="font-mono font-extrabold text-sm text-emerald-400">₹{activeStub.totalPrice}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#07090e] text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 border-t border-zinc-800/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FlexiBook Cryptographic Ledger Pass</span>
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
      />

      {/* Render Reschedule Modal */}
      <RescheduleModal
        isOpen={Boolean(rescheduleTarget)}
        ticket={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  );
};

export default MyBookingPage;