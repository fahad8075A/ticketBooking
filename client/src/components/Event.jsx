import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

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

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";

const categoryColors = {
  MUSIC: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  EVENTS: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  SPORTS: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  ART: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  FLIGHT: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  BUS: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  TRAIN: "bg-teal-500/10 text-teal-300 border-teal-500/30",
  MOVIE: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
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

const formatEventDate = (rawDate) => {
  if (!rawDate) return "UPCOMING";
  const parsed = new Date(rawDate);
  if (isNaN(parsed.getTime())) return rawDate;

  return parsed
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
};

const extractNumericPrice = (evt) => {
  if (!evt) return 0;

  const candidateValues = [
    evt.price,
    evt.pricePerSeat,
    evt.ticketPrice,
    evt.cost,
    evt.amount,
    evt.pricing?.price,
    evt.pricing?.basePrice,
    evt.seats?.[0]?.price,
  ];

  for (const val of candidateValues) {
    if (typeof val === "number" && !isNaN(val) && val > 0) return val;
    if (typeof val === "string" && !isNaN(Number(val)) && Number(val) > 0) {
      return Number(val);
    }
  }

  return 0;
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
      const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const cleanPath = imgProp.startsWith("/") ? imgProp : `/${imgProp}`;
      return `${rawBase}${cleanPath}`;
    }
  }

  return DEFAULT_FALLBACK_IMAGE;
};

const normalizeResponseData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.events)) return data.data.events;
  return [];
};

const EventCard = React.memo(({ item, onBook, onNavigate }) => {
  const eventId = item._id || item.id;
  const normalizedCategory = (item.category || "EVENTS").toUpperCase();
  const categoryTheme =
    categoryColors[normalizedCategory] || "bg-zinc-800 text-zinc-300 border-zinc-700";

  const eventPrice = extractNumericPrice(item);
  const eventDate = item.date || item.eventDate || item.startDate || item.createdAt;

  const hasSeatData = typeof item.totalSeats === "number" || typeof item.availableSeats === "number";
  const isSoldOut =
    item.availableSeats === 0 ||
    (typeof item.totalSeats === "number" &&
      item.totalSeats <= (item.bookedSeatsCount || item.occupiedSeats?.length || 0));

  const handleClick = (e) => {
    e.stopPropagation();
    onNavigate(eventId, item);
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      whileHover={{ y: -6 }}
      onClick={handleClick}
      className="group relative flex flex-col bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-300 cursor-pointer backdrop-blur-xs select-none"
    >
      {/* Card Image */}
      <div 
        onClick={handleClick}
        className="relative aspect-[16/11] w-full overflow-hidden bg-zinc-950 cursor-pointer"
      >
        <img
          src={resolveImage(item.image || item.imageUrl)}
          alt={item.title || "Event banner"}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-transparent to-black/30 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="backdrop-blur-md bg-black/60 text-zinc-200 font-semibold text-[10px] px-2.5 py-1 rounded-lg tracking-wider border border-white/10 shadow-sm">
            {formatEventDate(eventDate)}
          </span>

          <div className="flex items-center gap-1.5">
            {hasSeatData && (
              isSoldOut ? (
                <span className="backdrop-blur-md bg-rose-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded-lg tracking-wider uppercase shadow-sm whitespace-nowrap">
                  NOT AVAILABLE
                </span>
              ) : (
                <span className="backdrop-blur-md bg-emerald-500/20 text-emerald-300 font-bold text-[9px] px-2 py-0.5 rounded-lg border border-emerald-500/30 whitespace-nowrap">
                  AVAILABLE
                </span>
              )
            )}

            {item.badge && (
              <span className="backdrop-blur-md bg-amber-500 text-zinc-950 font-black text-[9px] px-2.5 py-0.5 rounded-lg tracking-wider uppercase shadow-sm">
                {item.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md border ${categoryTheme}`}>
              {item.category || "GENERAL"}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60">
              <FaStar className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-zinc-200">
                {item.rating || "4.8"}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-zinc-100 text-base leading-snug group-hover:text-sky-400 transition-colors duration-200 line-clamp-1">
            {item.title || item.name || "Untitled Listing"}
          </h3>

          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1.5">
            <FaMapMarkerAlt className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate">{item.location || item.from || "Location TBA"}</span>
          </div>

          {hasSeatData && (
            <div className="text-[11px] text-zinc-400 mt-2">
              {isSoldOut ? (
                <span className="text-rose-400 font-medium">All seats booked</span>
              ) : (
                <span>
                  Seats left:{" "}
                  <strong className="text-zinc-200">
                    {item.availableSeats ?? (item.totalSeats - (item.bookedSeatsCount || item.occupiedSeats?.length || 0))}
                  </strong>{" "}
                  / {item.totalSeats}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-zinc-800/80">
          <div>
            <span className="block text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
              Starts at
            </span>
            <span className="text-base font-extrabold text-white tracking-tight">
              ₹{Number(eventPrice).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            disabled={isSoldOut}
            onClick={(e) => onBook(item, e)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 z-10 ${
              isSoldOut
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                : "bg-sky-500 hover:bg-sky-400 text-white cursor-pointer shadow-md shadow-sky-500/20 active:scale-95"
            }`}
          >
            <span>{isSoldOut ? "Sold Out" : "Book"}</span>
            {!isSoldOut && (
              <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

EventCard.displayName = "EventCard";

const Event = ({ selectedCategory = "ALL" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const baseUrl = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;
        const endpoint = `${baseUrl}/events`;

        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        const response = await fetch(endpoint, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load events (Server returned ${response.status})`);
        }

        const data = await response.json();
        setEvents(normalizeResponseData(data));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    return () => controller.abort();
  }, [location.key]); // Re-fetches fresh seat availability when navigating back

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    if (selectedCategory.toUpperCase() === "ALL") return events;

    const targetCat = selectedCategory.toString().trim().toUpperCase();
    return events.filter((item) => {
      const itemCat = (item.category || "").toString().trim().toUpperCase();
      return itemCat === targetCat;
    });
  }, [events, selectedCategory]);

  const handleNavigate = (eventId, item) => {
    const categoryStr = (item.category || "").toString().trim().toLowerCase();

    if (categoryStr.includes("train")) {
      navigate(`/trains/${eventId}`, { state: { item } });
    } else {
      navigate(`/events/${eventId}`, { state: { event: item } });
    }
  };

  const handleBookNow = (item, e) => {
    e.stopPropagation();

    const isSoldOut =
      item.availableSeats === 0 ||
      (typeof item.totalSeats === "number" &&
        item.totalSeats <= (item.bookedSeatsCount || item.occupiedSeats?.length || 0));

    if (isSoldOut) return;

    const parsedPrice = extractNumericPrice(item);
    const bookingItem = {
      ...item,
      id: item._id || item.id,
      price: parsedPrice,
      ticketPrice: parsedPrice,
      category: item.category || "General",
    };

    // Deep identification string across title and category
    const rawIdentifier = [
      item.category,
      item.type,
      item.eventType,
      item.title,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .trim();

    // Comprehensive category routing
    let targetRoute = "/book/general";

    if (
      rawIdentifier.includes("sport") ||
      rawIdentifier.includes("cricket") ||
      rawIdentifier.includes("football") ||
      rawIdentifier.includes("soccer") ||
      rawIdentifier.includes("stadium") ||
      rawIdentifier.includes("match")
    ) {
      targetRoute = "/book/sports";
    } else if (rawIdentifier.includes("train") || rawIdentifier.includes("rail")) {
      targetRoute = "/book/train";
    } else if (rawIdentifier.includes("bus") || rawIdentifier.includes("coach")) {
      targetRoute = "/book/bus";
    } else if (
      rawIdentifier.includes("flight") ||
      rawIdentifier.includes("plane") ||
      rawIdentifier.includes("air")
    ) {
      targetRoute = "/book/flight";
    } else if (
      rawIdentifier.includes("movie") ||
      rawIdentifier.includes("cinema") ||
      rawIdentifier.includes("film")
    ) {
      targetRoute = "/book/movie";
    }

    const targetState = {
      item: bookingItem,
      event: bookingItem,
      ticketType: "Standard Entry",
      ticketPrice: parsedPrice,
      totalPrice: parsedPrice,
      quantity: 1,
    };

    navigate(targetRoute, { state: targetState });
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-md">
          <h3 className="font-semibold text-rose-400 text-sm">Failed to retrieve listings</h3>
          <p className="text-xs text-rose-300/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="py-20 text-center bg-zinc-900/40 backdrop-blur-sm rounded-3xl border border-zinc-800/80 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-zinc-100">No listings found</h3>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 px-6">
          There are currently no tickets available for "{selectedCategory}".
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {filteredEvents.map((item, idx) => {
          const eventId = item._id || item.id || `event-${idx}`;
          return (
            <EventCard
              key={eventId}
              item={item}
              onBook={handleBookNow}
              onNavigate={handleNavigate}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default Event;