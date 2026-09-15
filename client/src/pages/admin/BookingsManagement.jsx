import React, { useState, useEffect, useMemo } from "react";
import {
  TicketCheck,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Calendar,
  Trash2,
} from "lucide-react";

const getBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  return raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
};

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  const getAuthToken = () =>
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const res = await fetch(`${getBaseUrl()}/bookings`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Failed to load booking records");
      const data = await res.json();
      
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setBookings(list);
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setFeedback({ text: "", type: "" });
      const token = getAuthToken();

      const res = await fetch(`${getBaseUrl()}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Failed to update status");

      setBookings((prev) =>
        prev.map((b) =>
          (b._id || b.id) === bookingId ? { ...b, status: newStatus } : b
        )
      );
      setFeedback({
        text: `Booking marked as ${newStatus.toUpperCase()}`,
        type: "success",
      });
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Permanently delete this booking record?")) return;

    try {
      setUpdatingId(bookingId);
      setFeedback({ text: "", type: "" });
      const token = getAuthToken();

      const res = await fetch(`${getBaseUrl()}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Failed to delete booking");

      setBookings((prev) => prev.filter((b) => (b._id || b.id) !== bookingId));
      setFeedback({
        text: "Booking record deleted successfully.",
        type: "success",
      });
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const currentStatus = (b.status || "confirmed").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" || currentStatus === statusFilter;

      const customer = (b.customerName || b.userId?.name || "").toLowerCase();
      const email = (b.customerEmail || b.userId?.email || "").toLowerCase();
      const eventTitle = (b.eventId?.title || b.title || "").toLowerCase();
      const bookingId = (b._id || b.id || "").toLowerCase();
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        customer.includes(search) ||
        email.includes(search) ||
        eventTitle.includes(search) ||
        bookingId.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchTerm]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center border border-sky-200">
              <TicketCheck className="w-5 h-5 text-sky-600" />
            </div>
            Bookings & Manifest
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review confirmed reservations, customer emails, seats, and cancel tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBookings}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-700 hover:text-sky-700 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-sky-600 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback.text && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between shadow-xs ${
            feedback.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ text: "", type: "" })}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, email, event, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {["ALL", "CONFIRMED", "CANCELLED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === st
                  ? "bg-sky-500 text-white shadow-xs font-bold"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 uppercase text-[10px] tracking-wider text-slate-500 border-b border-slate-200/80 font-bold">
              <tr>
                <th className="px-6 py-4">Booking / Passenger</th>
                <th className="px-6 py-4">Event Item</th>
                <th className="px-6 py-4">Seats & Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-500 mb-2" />
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No reservations matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const id = b._id || b.id;
                  const passengerName =
                    b.customerName || b.userId?.name || "Guest Passenger";
                  const passengerEmail =
                    b.customerEmail || b.userId?.email || "No email on record";
                  const seats = b.selectedSeats?.length > 0
                    ? `Seats: ${b.selectedSeats.join(", ")}`
                    : `${b.numberOfSeats || b.quantity || 1} Seat(s)`;
                  const price = b.totalPrice || b.totalAmount || 0;
                  const isBusy = updatingId === id;
                  const status = (b.status || "confirmed").toLowerCase();

                  return (
                    <tr
                      key={id}
                      className="hover:bg-sky-50/40 transition-colors"
                    >
                      {/* Passenger Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-bold text-sky-700 text-xs shrink-0 shadow-2xs">
                            {passengerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {passengerName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {passengerEmail}
                            </p>
                            <span className="font-mono text-[10px] text-sky-600 font-bold block mt-0.5">
                              {id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Event Details */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {b.eventId?.title || b.title || "Ticket Item"}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {b.eventId?.date || b.date || "Confirmed Schedule"}
                        </p>
                      </td>

                      {/* Pricing and Seats */}
                      <td className="px-6 py-4">
                        <span className="font-black text-sky-700 text-sm">
                          ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {seats}
                        </p>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {status === "confirmed" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right space-x-2">
                        {status === "confirmed" ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleStatusUpdate(id, "cancelled")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition disabled:opacity-50 cursor-pointer"
                          >
                            Cancel Ticket
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleStatusUpdate(id, "confirmed")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition disabled:opacity-50 cursor-pointer"
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer inline-flex items-center align-middle"
                          title="Permanently delete booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;