import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  Search,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  MapPin,
  Star,
  X,
  ArrowRight,
} from "lucide-react";

// Local static image assets for admin table preview
import concert from "../../assets/concert.jpg";
import tech from "../../assets/tech.jpg";
import food from "../../assets/food.jpg";
import football from "../../assets/football.jpg";
import singer from "../../assets/singer.jpg";
import swim from "../../assets/swim.jpg";
import art from "../../assets/art.jpg";
import plane from "../../assets/plane.jpg";
import indigo from "../../assets/indigo.jpg";
import emirates from "../../assets/emirates.jpg";
import bus1 from "../../assets/bus1.jpg";
import bus2 from "../../assets/bus2.jpg";
import train1 from "../../assets/train1.jpg";
import train2 from "../../assets/train2.jpg";
import train3 from "../../assets/train3.jpg";
import bus3 from "../../assets/bus3.jpg";
import tennis from "../../assets/tennis.jpg";
import movie1 from "../../assets/movie1.jpg";
import movie2 from "../../assets/movie2.jpg";

const localImageMap = {
  concert, tech, food, football, singer, swim, art,
  plane, indigo, emirates, bus1, bus2, train1, train2,
  train3, bus3, tennis, movie1, movie2,
};

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=150&q=80";

// Ensure URL always points to a valid absolute path
const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = (rawApiUrl && rawApiUrl.length > 0)
  ? rawApiUrl.replace(/\/$/, "")
  : "http://localhost:5000/api";

const CATEGORIES = ["ALL", "FLIGHT", "TRAIN", "BUS", "MUSIC", "EVENTS", "SPORTS", "ART", "MOVIE"];
const TRAVEL_CATEGORIES = ["FLIGHT", "BUS", "TRAIN"];

const categoryColors = {
  MUSIC: "bg-purple-50 text-purple-700 border-purple-200",
  EVENTS: "bg-sky-50 text-sky-700 border-sky-200",
  SPORTS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ART: "bg-rose-50 text-rose-700 border-rose-200",
  FLIGHT: "bg-blue-50 text-blue-700 border-blue-200",
  BUS: "bg-amber-50 text-amber-700 border-amber-200",
  TRAIN: "bg-teal-50 text-teal-700 border-teal-200",
  MOVIE: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const formatDisplayDate = (rawDate) => {
  if (!rawDate) return "Upcoming";
  const parsed = new Date(rawDate);
  if (isNaN(parsed.getTime())) return rawDate;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const resolveImage = (imgProp) => {
  if (!imgProp) return DEFAULT_FALLBACK_IMAGE;
  if (localImageMap[imgProp]) return localImageMap[imgProp];

  if (typeof imgProp === "string") {
    const cleanKey = imgProp.replace(/\.[^/.]+$/, "").trim();
    if (localImageMap[cleanKey]) return localImageMap[cleanKey];

    if (imgProp.startsWith("http://") || imgProp.startsWith("https://")) {
      return imgProp;
    }

    if (imgProp.includes("uploads") || imgProp.startsWith("/")) {
      const baseUrl = API_BASE_URL.replace(/\/api.*$/, "");
      const cleanPath = imgProp.startsWith("/") ? imgProp : `/${imgProp}`;
      return `${baseUrl}${cleanPath}`;
    }
  }

  return DEFAULT_FALLBACK_IMAGE;
};

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "EVENTS",
    price: "",
    location: "",
    departure: "",
    arrival: "",
    date: "",
    rating: "4.8",
    badge: "",
    image: "",
  });

  const isTravelCategory = TRAVEL_CATEGORIES.includes(formData.category.toUpperCase());

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/events`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events || data.data || []);
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesCat =
        selectedCategory === "ALL" ||
        (evt.category || "").toUpperCase() === selectedCategory;
      const matchesSearch =
        (evt.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.location || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const openAddModal = () => {
    setEditingEventId(null);
    setFormData({
      title: "",
      category: "EVENTS",
      price: "",
      location: "",
      departure: "",
      arrival: "",
      date: "",
      rating: "4.8",
      badge: "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (evt) => {
    const id = evt._id || evt.id;
    setEditingEventId(id);
    const existingPrice = evt.price ?? evt.pricePerSeat ?? evt.ticketPrice ?? "";
    const cat = (evt.category || "EVENTS").toUpperCase();

    let departure = "";
    let arrival = "";
    if (evt.location && evt.location.includes("→")) {
      const parts = evt.location.split("→");
      departure = parts[0]?.trim() || "";
      arrival = parts[1]?.trim() || "";
    } else if (evt.location && evt.location.includes(" to ")) {
      const parts = evt.location.split(" to ");
      departure = parts[0]?.trim() || "";
      arrival = parts[1]?.trim() || "";
    }

    setFormData({
      title: evt.title || "",
      category: cat,
      price: existingPrice,
      location: evt.location || "",
      departure,
      arrival,
      date: evt.date || "",
      rating: evt.rating ? String(evt.rating) : "4.8",
      badge: evt.badge || "",
      image: evt.image || evt.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ text: "", type: "" });

    try {
      const endpoint = editingEventId
        ? `${API_BASE_URL}/events/${editingEventId}`
        : `${API_BASE_URL}/events`;
      const method = editingEventId ? "PUT" : "POST";

      const numericPrice = Number(formData.price || 0);
      const numericRating = Number(formData.rating) > 0 ? Number(formData.rating) : 4.8;

      let finalLocation = formData.location.trim();
      if (isTravelCategory) {
        finalLocation = `${formData.departure.trim()} → ${formData.arrival.trim()}`;
      }

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        price: numericPrice,
        pricePerSeat: numericPrice,
        ticketPrice: numericPrice,
        rating: numericRating,
        location: finalLocation,
        date: formData.date.trim(),
        badge: formData.badge?.trim() || "",
        image: formData.image?.trim() || "",
        imageUrl: formData.image?.trim() || "",
      };

      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Operation failed");

      setFeedback({
        text: `Event ${editingEventId ? "updated" : "created"} successfully!`,
        type: "success",
      });
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!id) {
      setFeedback({ text: "Invalid event ID", type: "error" });
      return;
    }
    if (!window.confirm(`Delete "${title}"?`)) return;

    try {
      const deleteUrl = `${API_BASE_URL}/events/${id}`;
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete event (${res.status})`);
      }

      setEvents((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setFeedback({ text: "Event deleted successfully", type: "success" });
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center border border-sky-200">
              <CalendarDays className="w-5 h-5 text-sky-600" />
            </div>
            Event & Travel Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create tickets, manage schedules, adjust ratings, pricing, and routes.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow-sky-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Event
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
            onClick={() => setFeedback({ text: "", type: "" })}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, venue, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredEvents.length}</strong> listings
          </span>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-sky-500 text-white shadow-xs font-bold"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 uppercase text-[10px] tracking-wider text-slate-500 border-b border-slate-200/80 font-bold">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Date / Route / Venue</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-500 mb-2" />
                    Loading events...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const id = evt._id || evt.id;
                  const catUpper = (evt.category || "EVENTS").toUpperCase();
                  const theme = categoryColors[catUpper] || "bg-slate-100 text-slate-700 border-slate-200";
                  const eventPrice = evt.price ?? evt.pricePerSeat ?? evt.ticketPrice ?? 0;
                  const displayDate = formatDisplayDate(evt.date || evt.eventDate || evt.createdAt);
                  const displayRating = Number(evt.rating || 4.8).toFixed(1);

                  return (
                    <tr key={id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                            <img
                              src={resolveImage(evt.image || evt.imageUrl)}
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_FALLBACK_IMAGE;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{evt.title}</p>
                            {evt.badge && (
                              <span className="inline-block mt-0.5 bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.2 rounded text-[9px] font-bold">
                                {evt.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${theme}`}>
                          {catUpper}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50/90 border border-amber-200/70">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span className="font-bold text-amber-900 text-xs">{displayRating}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-slate-800 font-medium">{displayDate}</p>
                        <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {evt.location || "TBA"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sky-700 font-black text-sm">
                          ₹{Number(eventPrice).toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-1.5">
                        <button
                          onClick={() => openEditModal(evt)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(id, evt.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingEventId ? "Edit Listing" : "Create New Listing"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                  {isTravelCategory ? "Carrier / Vehicle Name" : "Title"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={isTravelCategory ? "e.g. IndiGo, Rajdhani Express, Volvo Sleeper" : "e.g. Coldplay Tour"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  >
                    {CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 14999"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">Date / Schedule</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. JAN 13"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                    Rating (★)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="e.g. 4.8"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. PREMIUM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* DYNAMIC ROUTE VS VENUE FIELD */}
              {isTravelCategory ? (
                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                    Travel Route (Departure & Arrival)
                  </label>
                  <div className="grid grid-cols-11 items-center gap-2">
                    <div className="col-span-5">
                      <input
                        type="text"
                        required
                        value={formData.departure}
                        onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                        placeholder="From (e.g. New York JFK)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition text-xs"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        required
                        value={formData.arrival}
                        onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
                        placeholder="To (e.g. London LHR)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition text-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. DY Patil Stadium, Mumbai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">Image URL / Asset Key</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://... or indigo, plane, bus1, train1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? "Saving..." : editingEventId ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;