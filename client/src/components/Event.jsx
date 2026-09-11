import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Local image imports
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

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";

const categoryColors = {
  MUSIC: "bg-purple-50 text-purple-700 border-purple-200/80",
  EVENTS: "bg-blue-50 text-blue-700 border-blue-200/80",
  SPORTS: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  ART: "bg-rose-50 text-rose-700 border-rose-200/80",
  FLIGHT: "bg-sky-50 text-sky-700 border-sky-200/80",
  BUS: "bg-amber-50 text-amber-800 border-amber-200/80",
  TRAIN: "bg-teal-50 text-teal-700 border-teal-200/80",
  MOVIE: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const resolveImage = (imgProp) => {
  if (!imgProp) return DEFAULT_FALLBACK_IMAGE;
  if (localImageMap[imgProp]) return localImageMap[imgProp];
  if (typeof imgProp === "string" && (imgProp.startsWith("http") || imgProp.startsWith("/"))) {
    return imgProp;
  }
  return DEFAULT_FALLBACK_IMAGE;
};

const EventCard = React.memo(({ item, eventId, onBook, onNavigate }) => {
  const normalizedCategory = (item.category || "").toUpperCase();
  const categoryTheme = categoryColors[normalizedCategory] || "bg-slate-50 text-slate-700 border-slate-200/80";

  return (
    <motion.div
      key={eventId}
      layout
      variants={cardVariants}
      whileHover={{ y: -6 }}
      onClick={() => onNavigate(eventId, item)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden ring-1 ring-slate-900/5 shadow-sm hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
        <img
          src={resolveImage(item.image)}
          alt={item.title || "Event banner"}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="backdrop-blur-md bg-black/45 text-white font-medium text-[11px] px-2.5 py-1 rounded-md tracking-wide border border-white/10 shadow-sm">
            {item.date || "Upcoming"}
          </span>
          {item.badge && (
            <span className="backdrop-blur-md bg-white/95 text-slate-800 font-bold text-[10px] px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm">
              {item.badge}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between gap-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryTheme}`}>
              {item.category || "GENERAL"}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50/80 border border-amber-200/60">
              <FaStar className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-amber-900">
                {item.rating || "4.8"}
              </span>
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
            {item.title || "Untitled Event"}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1.5">
            <FaMapMarkerAlt className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{item.location || "Venue details TBA"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Starts at
            </span>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              ₹{Number(item.price || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => onBook(item, e)}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>Book</span>
            <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

EventCard.displayName = "EventCard";

const Event = ({ selectedCategory = "ALL" }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL ;
        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        const response = await fetch(`${apiUrl}/api/v1/events`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load events (Status: ${response.status})`);
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    return () => controller.abort();
  }, []);

  const filteredEvents = useMemo(() => {
    const safeList = Array.isArray(events) ? events : [];
    if (selectedCategory.toUpperCase() === "ALL") return safeList;

    const targetCat = selectedCategory.toString().trim().toUpperCase();
    return safeList.filter((item) => {
      const itemCat = (item.category || "").toString().trim().toUpperCase();
      return itemCat === targetCat;
    });
  }, [events, selectedCategory]);

  const handleNavigate = (eventId, item) => {
    navigate(`/event/${eventId}`, { state: { event: item } });
  };

  const handleBookNow = (item, e) => {
    e.stopPropagation();
    const eventId = item._id || item.id;

    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true" ||
      localStorage.getItem("isAuthenticated") === "true";

    if (isAuthenticated) {
      navigate(`/event/${eventId}`, { state: { event: item } });
    } else {
      navigate("/login", {
        state: {
          redirectTo: `/event/${eventId}`,
          redirectState: { event: item },
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl max-w-md">
          <h3 className="font-semibold text-rose-800 text-sm">Failed to retrieve events</h3>
          <p className="text-xs text-rose-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1.2px, transparent 1.2px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[52rem] h-[26rem] rounded-full bg-gradient-to-tr from-sky-200/35 via-blue-100/30 to-indigo-200/35 blur-3xl" />
        <div className="absolute top-1/2 -left-36 w-[28rem] h-[28rem] rounded-full bg-slate-200/45 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-[30rem] h-[30rem] rounded-full bg-indigo-100/35 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-800">No events found</h3>
            <p className="text-sm text-slate-500 mt-2 px-6">
              There are no events available for "{selectedCategory}".
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((item, idx) => {
                const eventId = item._id || item.id || `event-fallback-${idx}`;
                return (
                  <EventCard
                    key={eventId}
                    item={item}
                    eventId={eventId}
                    onBook={handleBookNow}
                    onNavigate={handleNavigate}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Event;