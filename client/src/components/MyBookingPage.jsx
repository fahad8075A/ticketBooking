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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";

// --- Digital Boarding Pass Modal ---
const DigitalTicketModal = ({ ticket, isOpen, onClose }) => {
  if (!isOpen || !ticket) return null;

  const event = ticket.eventId || {};
  const name = ticket.customerName || "GUEST PASSENGER";
  const destination = event.location || "COCHIN";
  const origin = event.from || "ORIGIN";
  const title = event.title || "EXPRESS ENTRY";
  const bookingId = ticket._id || "TRN-826491";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-[920px]">
        {/* Modal Controls */}
        <div className="w-full flex justify-between items-center mb-3 text-white">
          <span className="font-semibold text-sm tracking-wide">
            Digital Pass Preview
          </span>
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

        {/* Boarding Pass Container */}
        <div className="w-full bg-white rounded-[26px] shadow-2xl overflow-hidden flex flex-row relative min-h-[380px] border border-gray-100">
          {/* Left Ribbon */}
          <div className="w-14 sm:w-20 bg-gradient-to-b from-[#4438ca] via-[#2563eb] to-[#06b6d4] flex flex-col justify-between items-center py-8 select-none text-white shrink-0">
            <span className="font-extrabold text-xs sm:text-base tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
              FLEXIBOOK
            </span>
            <span className="font-bold text-[10px] sm:text-xs tracking-[0.2em] text-cyan-200 [writing-mode:vertical-rl] rotate-180 uppercase">
              Digital Pass
            </span>
          </div>

          {/* Ticket Body */}
          <div className="flex-1 bg-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
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

            {/* Row 2: Event Details */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Event / Trip
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate">
                  {title}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Date
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 whitespace-nowrap">
                  {event.date || "Scheduled"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate">
                  {ticket.customerEmail}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Seats
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                  {ticket.numberOfSeats} Seat{ticket.numberOfSeats > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Row 3: Barcode & Info */}
            <div className="grid grid-cols-12 gap-4 items-end pt-2">
              <div className="col-span-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Booking ID
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 font-mono truncate">
                  {bookingId}
                </p>
              </div>

              <div className="col-span-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Booking Status
                </p>
                <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 uppercase tracking-wide">
                  {ticket.status}
                </p>
              </div>

              <div className="col-span-5 flex justify-end">
                <div className="flex items-end gap-[3px] h-11">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2].map(
                    (w, i) => (
                      <span
                        key={i}
                        className="bg-gray-900 h-full inline-block"
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

// --- Reschedule Date Picker Modal ---
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#143d59] text-base">Reschedule Booking</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Select a new date for <b>{ticket.eventId?.title}</b> ({ticket._id}).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
              Select New Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#143d59]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#143d59] hover:bg-[#0f2e43] text-white py-2 rounded-lg text-xs font-semibold transition shadow-xs"
            >
              Save New Date
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
  const [modalTicket, setModalTicket] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [activeStub, setActiveStub] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Initial Load: Check for incoming new booking OR fetch existing bookings
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const incoming = location.state?.newBooking;

        // If navigated directly from checkout/payment with a new booking payload, save it first
        if (incoming && (incoming.eventId || incoming.event?._id || incoming.event?.id)) {
          const eventIdentifier =
            incoming.eventId || incoming.event?._id || incoming.event?.id;

          const payload = {
            customerName: incoming.name || incoming.customerName,
            customerEmail: incoming.email || incoming.customerEmail,
            eventId: eventIdentifier,
            numberOfSeats: incoming.quantity || incoming.numberOfSeats || 1,
            totalPrice: incoming.total || incoming.totalPrice || 0,
            status: "confirmed",
          };

          const postRes = await fetch(`${apiUrl}/api/v1/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (postRes.ok) {
            // Clear router history state so refresh doesn't trigger duplicate creates
            window.history.replaceState({}, document.title);
          }
        }

        // Fetch all bookings from backend
        const response = await fetch(`${apiUrl}/api/v1/bookings`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        
        const bookingList = Array.isArray(data) ? data : [];
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

    initializeWallet();
  }, [apiUrl, location.state]);

  // Cancel Booking
  const handleCancelBooking = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${id}?`)) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) throw new Error("Failed to cancel booking");
      const updatedItem = await response.json();

      const updatedList = bookings.map((b) => (b._id === id ? updatedItem : b));
      setBookings(updatedList);
      if (activeStub?._id === id) setActiveStub(updatedItem);
    } catch (err) {
      alert(err.message);
    }
  };

  // Reschedule Booking
  const handleConfirmReschedule = async (id, newDateStr) => {
    const formattedDate = new Date(newDateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const target = bookings.find((b) => b._id === id);
    if (!target) return;

    try {
      const eventId = target.eventId?._id || target.eventId;
      const response = await fetch(`${apiUrl}/api/v1/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formattedDate }),
      });

      if (!response.ok) throw new Error("Failed to reschedule event date");

      // Refresh booking list after updating event date
      const updatedListResponse = await fetch(`${apiUrl}/api/v1/bookings`);
      const updatedList = await updatedListResponse.json();
      setBookings(updatedList);
      const refreshedActive = updatedList.find((b) => b._id === id);
      if (refreshedActive) setActiveStub(refreshedActive);
    } catch (err) {
      alert("Failed to reschedule date: " + err.message);
    }
  };

  // Remove / Delete Booking
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking record?")) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/bookings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      const updatedList = bookings.filter((b) => b._id !== id);
      setBookings(updatedList);
      if (activeStub?._id === id) {
        setActiveStub(updatedList[0] || null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your ticket wallet...
      </div>
    );
  }

  const activeCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans">
      <main className="max-w-[1240px] mx-auto px-6 py-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a446c]">
              Your Ticket Wallet
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Manage, reschedule, or cancel your active booking stubs securely.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 bg-gray-100/80 hover:bg-gray-200 text-gray-700 text-xs px-4 py-1.5 rounded-full font-medium transition cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" /> Back
            </button>
            <div className="bg-[#1f7a28] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xs">
              {activeCount} Active Ticket{activeCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cards Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-sm">No tickets found in your wallet.</p>
              </div>
            ) : (
              bookings.map((item) => {
                const isSelected = activeStub?._id === item._id;
                const isCancelled = item.status === "cancelled";
                const event = item.eventId || {};

                return (
                  <div
                    key={item._id}
                    onClick={() => setActiveStub(item)}
                    className={`bg-white rounded-2xl p-6 relative overflow-hidden transition cursor-pointer border ${
                      isSelected
                        ? "border-[#143d59] ring-2 ring-[#143d59]/10 shadow-lg"
                        : "border-gray-200/80 shadow-xs hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-[#eef4f8] text-[#1e4b6d] text-[11px] font-bold px-3 py-1 rounded-md font-mono tracking-wider">
                        {item._id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase ${
                            isCancelled ? "bg-rose-600" : "bg-[#1f7a28]"
                          }`}
                        >
                          {item.status}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item._id);
                          }}
                          className="text-gray-300 hover:text-red-500 p-1 transition"
                          title="Delete ticket"
                        >
                          <FaTrashAlt className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 my-3">
                      <img
                        src={event.image || FALLBACK_IMAGE}
                        alt={event.title || "Event Image"}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-[#143d59] truncate">
                          {event.title || "Event Booking"}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-gray-400 text-[10px]" />
                            {event.location || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400 text-[10px]" />
                            {event.date || "Scheduled"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalTicket(item);
                        }}
                        className="w-full sm:flex-1 bg-[#143d59] hover:bg-[#0f2e43] text-white py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
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
                            className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <FaCalendarCheck className="text-[10px]" /> Reschedule
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(item._id);
                            }}
                            className="w-full sm:w-auto bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
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
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[390px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                <div className="bg-[#143d59] text-white text-center py-6 px-4">
                  <p className="text-[11px] font-bold text-[#f97316] tracking-widest uppercase">
                    Pass Wallet Stub
                  </p>
                  <h3 className="text-lg font-bold mt-1">
                    {activeStub.eventId?.title || "Event Pass"}
                  </h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {activeStub.eventId?.date || "Scheduled"}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-white border-b border-dashed border-gray-200">
                  <div className="bg-white p-2 border border-gray-200 rounded-xl shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        activeStub._id
                      )}`}
                      alt="Gate Scanner QR"
                      className="w-36 h-36"
                    />
                  </div>
                  <p className="text-sm font-bold text-[#ea580c] font-mono tracking-wider mt-4">
                    {activeStub._id}
                  </p>
                </div>

                <div className="p-6 bg-white space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Holder</span>
                    <span className="font-bold text-gray-800">{activeStub.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Email</span>
                    <span className="font-bold text-gray-800">{activeStub.customerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Seats</span>
                    <span className="font-bold text-gray-800">{activeStub.numberOfSeats}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className={`font-bold uppercase ${activeStub.status === 'cancelled' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {activeStub.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Total Paid</span>
                    <span className="font-extrabold text-sm text-[#143d59]">₹{activeStub.totalPrice}</span>
                  </div>
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