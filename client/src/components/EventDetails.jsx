import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Bookmark,
  Check,
  Compass,
  Share2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import mapFallback from "../assets/map.jpg";

// Static local assets
import foodImg from "../assets/food.jpg";
import concertImg from "../assets/concert.jpg";
import techImg from "../assets/tech.jpg";
import footballImg from "../assets/football.jpg";
import flightImg from "../assets/flight.jpg";
import planeImg from "../assets/plane.jpg";
import trainImg from "../assets/train.jpg";
import train1Img from "../assets/train1.jpg";
import eventsImg from "../assets/events.jpg";
import singerImg from "../assets/singer.jpg";
import swimImg from "../assets/swim.jpg";
import tennisImg from "../assets/tennis.jpg";
import movie1Img from "../assets/movie1.jpg";
import movie2Img from "../assets/movie2.jpg";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80";

const BUS_DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80";

const ASSET_MAP = {
  bus: BUS_DEFAULT_IMAGE,
  buses: BUS_DEFAULT_IMAGE,
  food: foodImg,
  concert: concertImg,
  tech: techImg,
  football: footballImg,
  flight: flightImg,
  flights: flightImg,
  plane: planeImg,
  train: trainImg,
  train1: train1Img,
  trains: trainImg,
  event: eventsImg,
  events: eventsImg,
  singer: singerImg,
  swim: swimImg,
  tennis: tennisImg,
  movie1: movie1Img,
  movie2: movie2Img,
};

const resolveEventImage = (rawImage, category = "") => {
  if (typeof rawImage === "string" && (rawImage.startsWith("http://") || rawImage.startsWith("https://"))) {
    return rawImage;
  }

  if (typeof rawImage === "string" && (rawImage.startsWith("/") || rawImage.includes("uploads"))) {
    const backendUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/api.*$/, "");
    const cleanPath = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
    return `${backendUrl}${cleanPath}`;
  }

  if (typeof rawImage === "string" && rawImage.trim()) {
    const cleanKey = rawImage.replace(/\.[^/.]+$/, "").toLowerCase().trim();
    if (ASSET_MAP[cleanKey]) return ASSET_MAP[cleanKey];

    const matchedKey = Object.keys(ASSET_MAP).find((k) => cleanKey.includes(k));
    if (matchedKey) return ASSET_MAP[matchedKey];
  }

  const cleanCategory = String(category).toLowerCase().trim();
  if (ASSET_MAP[cleanCategory]) {
    return ASSET_MAP[cleanCategory];
  }
  const matchedCatKey = Object.keys(ASSET_MAP).find((k) => cleanCategory.includes(k));
  if (matchedCatKey) return ASSET_MAP[matchedCatKey];

  return DEFAULT_FALLBACK_IMAGE;
};

const getEventFieldValue = (event, key) => {
  if (!event) return "—";

  const direct =
    event[key] ??
    event.metadata?.[key] ??
    event.meta?.[key] ??
    event.details?.[key];

  if (direct !== undefined && direct !== null && direct !== "") return direct;

  switch (key) {
    case "duration":
      return event.time || event.totalTime || "2 Days";
    case "age":
      return event.ageLimit || event.minAge || "ALL AGES";
    case "lineup":
      return event.artist || event.artists || event.organizer || "10+ ARTISTS";
    case "capacity":
      return event.totalSeats ? `${event.totalSeats}` : "10K";
    default:
      return "—";
  }
};

const EventDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [event, setEvent] = useState(state?.event || null);
  const [loading, setLoading] = useState(!state?.event);
  const [selectedTierIndex, setSelectedTierIndex] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!event && id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const API_BASE_URL =
            import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
          const res = await fetch(`${API_BASE_URL}/events/${id}`);
          if (!res.ok) throw new Error("Failed to fetch event");
          const data = await res.json();
          setEvent(data?.event || data?.data || data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, event]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-sky-500 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
          Loading details...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-zinc-100">Event Not Found</h2>
        <button
          onClick={() => navigate("/browse")}
          className="mt-4 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const basePrice = Number(
    event.price ?? event.ticketPrice ?? event.pricePerSeat ?? 1500
  );
  const vipPrice = Math.round(basePrice * 1.6);

  const ticketTiers = event.ticketTiers || [
    {
      title: "Standard Entry",
      subtitle: "Access To Main Area",
      price: basePrice,
      badge: `₹${basePrice.toFixed(2)}`,
      perks: ["Reserved standard seat/spot", "Standard boarding pass"],
    },
    {
      title: "VIP Pass",
      subtitle: "Priority Access",
      price: vipPrice,
      badge: `₹${vipPrice.toFixed(2)}`,
      isPopular: true,
      perks: ["Priority check-in & boarding", "Complimentary snacks & water"],
    },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          url: window.location.href,
        });
      } catch {
        // dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinueBooking = () => {
    const chosenTicket = ticketTiers[selectedTierIndex] || ticketTiers[0];

    const bookingItem = {
      ...event,
      id: event._id || event.id,
      title: event.title,
      category: event.category || "General",
      price: chosenTicket.price,
      ticketType: chosenTicket.title,
    };

    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true" ||
      localStorage.getItem("isAuthenticated") === "true" ||
      Boolean(
        localStorage.getItem("token") ||
          sessionStorage.getItem("token") ||
          localStorage.getItem("authToken")
      );

    if (isAuthenticated) {
      navigate("/book/seats", {
        state: { item: bookingItem },
      });
    } else {
      navigate("/login", {
        state: {
          redirectTo: "/book/seats",
          redirectState: { item: bookingItem },
        },
      });
    }
  };

  const heroImage = resolveEventImage(
    event.image || event.imageUrl,
    event.category || event.type
  );

  return (
    <div className="bg-[#0b0d11] min-h-screen w-full font-sans text-zinc-200 pb-24 lg:pb-16 pt-4 lg:pt-6">
      {/* Top Bar Back & Share */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Mobile Share Icon in Header */}
        <button
          onClick={handleShare}
          className="lg:hidden p-2 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 transition"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            {/* Hero Image Container: On mobile it fills the primary viewport area without extra height */}
            <div className="relative h-[55vh] sm:h-80 md:h-[400px] lg:h-[420px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
              <img
                src={heroImage}
                alt={event.title || "Event Image"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-black/40 to-transparent" />

              <button
                onClick={() => setBookmarked(!bookmarked)}
                aria-label="Bookmark event"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 flex items-center justify-center text-zinc-300 hover:text-white transition shadow-lg cursor-pointer"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    bookmarked ? "fill-sky-400 text-sky-400" : ""
                  }`}
                />
              </button>

              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold text-[10px] tracking-wider uppercase mb-2">
                  {event.category || "EVENT / TRANSIT"}
                </span>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
                  {event.title}
                </h1>
                <p className="flex items-center gap-1.5 text-zinc-300 text-xs sm:text-sm mt-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{event.location || "Central Station / Venue"}</span>
                </p>
                <p className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                  <Calendar className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>{event.date || "Scheduled Today"}</span>
                </p>
              </div>
            </div>

            {/* Quick Specs - Visible on all screens, compact on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {[
                { label: "DURATION", val: getEventFieldValue(event, "duration") },
                { label: "AGE LIMIT", val: getEventFieldValue(event, "age") },
                { label: "OPERATOR", val: getEventFieldValue(event, "lineup") },
                { label: "CAPACITY", val: getEventFieldValue(event, "capacity") },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="bg-zinc-900/60 border-l-4 border-l-sky-500 border border-zinc-800/80 rounded-2xl p-3 text-center backdrop-blur-xs"
                >
                  <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                    {spec.label}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-zinc-100 mt-1 truncate">
                    {spec.val}
                  </p>
                </div>
              ))}
            </div>

            {/* DESKTOP-ONLY DETAILS (Hidden on Mobile to prevent long scrolls) */}
            <div className="hidden lg:block space-y-8">
              {/* About Section */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-xs">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  About
                </h2>
                <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                  {event.description ||
                    "Direct ticketing, verified timings, and reserved seats with complete real-time status updates."}
                </p>
              </div>

              {/* Ticket Selector Cards */}
              <div className="grid grid-cols-2 gap-5">
                {ticketTiers.map((tier, idx) => {
                  const isSelected = selectedTierIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedTierIndex(idx)}
                      className={`relative rounded-3xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-2 border-sky-500 bg-zinc-900/90 shadow-lg ring-1 ring-sky-500/30"
                          : "border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-white text-base">
                            {tier.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold">
                            {tier.badge}
                          </span>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {tier.perks.map((perk, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                              <Check className="w-3.5 h-3.5 text-sky-400" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTierIndex(idx);
                        }}
                        className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : "border border-zinc-700 bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar (Hidden on Mobile, Sticky on Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-5 lg:sticky lg:top-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    SCHEDULED DATE
                  </p>
                  <p className="text-base font-extrabold text-white mt-1">
                    {event.date || "2026-12-13"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-zinc-800 text-sky-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinueBooking}
                className="w-full mt-6 py-3 px-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl p-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-bold text-zinc-200">Venue / Station Map</span>
                <Compass className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <img
                src={mapFallback}
                alt="Venue Map"
                className="w-full h-36 object-cover rounded-xl mt-3 opacity-80"
              />
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM BAR (Always gives the user instant access to Book without scrolling) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800/90 flex items-center justify-between z-50">
        <div>
          <p className="text-[10px] font-medium text-zinc-400">Starting from</p>
          <p className="text-base font-extrabold text-white">₹{basePrice}</p>
        </div>
        <button
          onClick={handleContinueBooking}
          className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/20"
        >
          <span>Book Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default EventDetails;