import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaTrain, FaTicketAlt, FaBus, FaFilm } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { ArrowRight, Sparkles } from "lucide-react";

// Local static asset imports
import flightFallback from "../assets/flight.jpg";
import trainFallback from "../assets/train.jpg";
import eventsFallback from "../assets/events.jpg";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const ASSET_IMAGE_MAP = {
  flight: flightFallback,
  flights: flightFallback,
  plane: flightFallback,
  train: trainFallback,
  trains: trainFallback,
  event: eventsFallback,
  events: eventsFallback,
};

const ICON_MAP = {
  plane: <FaPlane className="w-3.5 h-3.5 text-sky-400" />,
  train: <FaTrain className="w-3.5 h-3.5 text-sky-400" />,
  event: <MdEvent className="w-3.5 h-3.5 text-sky-400" />,
  events: <MdEvent className="w-3.5 h-3.5 text-sky-400" />,
  flights: <FaPlane className="w-3.5 h-3.5 text-sky-400" />,
  trains: <FaTrain className="w-3.5 h-3.5 text-sky-400" />,
  bus: <FaBus className="w-3.5 h-3.5 text-sky-400" />,
  movie: <FaFilm className="w-3.5 h-3.5 text-sky-400" />,
  default: <FaTicketAlt className="w-3.5 h-3.5 text-sky-400" />,
};

const DEFAULT_DESCRIPTIONS = {
  flights: "Global destinations at your fingertips.",
  trains: "Discover scenic routes with every journey.",
  events: "Unforgettable live experiences around you.",
  bus: "Affordable city-to-city express rides.",
  movie: "Catch the latest blockbusters on big screens.",
};

const resolveCategoryImage = (imageField, normalizedKey) => {
  if (!imageField) {
    return ASSET_IMAGE_MAP[normalizedKey] || flightFallback;
  }

  if (imageField.startsWith("http://") || imageField.startsWith("https://")) {
    return imageField;
  }

  if (imageField.startsWith("/")) {
    return imageField;
  }

  const cleanKey = imageField.replace(/\.[^/.]+$/, "").toLowerCase().trim();
  if (ASSET_IMAGE_MAP[cleanKey]) {
    return ASSET_IMAGE_MAP[cleanKey];
  }

  return ASSET_IMAGE_MAP[normalizedKey] || flightFallback;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const BrowseCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/categories`);

        if (!res.ok) {
          throw new Error(`Failed to load categories (Status: ${res.status})`);
        }

        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="relative w-full bg-[#050913] text-white py-14 sm:py-20 border-b border-slate-800/80 overflow-hidden font-sans">
      {/* Background Radial Glow Matching Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] mb-3">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>EXPLORE EXPERIENCES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Browse Categories
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Find premium flights, high-speed rail, interstate buses, and trending events.
            </p>
          </div>

          <button
            onClick={() => navigate("/browsing")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-500/50 backdrop-blur-md text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Skeleton Loading State */}
        {loading && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-hidden">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-[82vw] sm:w-auto shrink-0 h-80 sm:h-96 md:h-[400px] rounded-3xl p-2.5 bg-gradient-to-b from-white/10 to-transparent border border-white/10 animate-pulse"
              >
                <div className="w-full h-full bg-slate-900/60 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error Fallback */}
        {error && !loading && (
          <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-800/40 text-center max-w-xl mx-auto backdrop-blur-md">
            <p className="text-rose-400 font-medium text-xs sm:text-sm">
              Unable to load categories: {error}
            </p>
          </div>
        )}

        {/* Categories Grid / Slider */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {categories.map((item, index) => {
              const normalizedKey = (
                item.code ||
                item.slug ||
                item.categoryKey ||
                item.name ||
                item.title ||
                ""
              ).toLowerCase();

              const displayName =
                item.name || item.title || item.label || item.code;

              const finalImageSrc = resolveCategoryImage(
                item.imageUrl || item.image,
                normalizedKey
              );

              const iconLookupKey = (
                item.iconName ||
                item.iconKey ||
                normalizedKey
              ).toLowerCase();
              const categoryIcon = ICON_MAP[iconLookupKey] || ICON_MAP.default;

              const badgeText =
                item.badge ||
                (normalizedKey === "flights" || normalizedKey === "flight"
                  ? "MOST POPULAR"
                  : normalizedKey === "trains" || normalizedKey === "train"
                  ? "FAST ROUTE"
                  : null);

              const descriptionText =
                item.subtitle ||
                item.tagline ||
                item.desc ||
                item.description ||
                DEFAULT_DESCRIPTIONS[normalizedKey] ||
                `Discover options in ${displayName}`;

              return (
                <motion.div
                  key={item._id || item.id || item.code || index}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => navigate(`/browsing?category=${normalizedKey}`)}
                  className={`group relative h-80 sm:h-96 md:h-[400px] rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/10 hover:border-sky-500/50 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all duration-300 cursor-pointer shrink-0 snap-center w-[82vw] sm:w-auto ${
                    index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  {/* Inner Image Wrapper */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src={finalImageSrc}
                      alt={displayName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = ASSET_IMAGE_MAP[normalizedKey] || flightFallback;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                      draggable={false}
                    />

                    {/* Dark Lighting Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050913] via-[#050913]/40 to-transparent pointer-events-none" />

                    {/* Top Floating Badge */}
                    {badgeText && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold tracking-wider uppercase text-white bg-sky-500/90 backdrop-blur-md shadow-md border border-sky-400/30">
                          {badgeText}
                        </span>
                      </div>
                    )}

                    {/* Bottom Content Area */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-700/80 backdrop-blur-md flex items-center justify-center shrink-0">
                          {categoryIcon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                          {displayName}
                        </h3>
                      </div>

                      <p className="text-slate-300 text-xs sm:text-sm line-clamp-1 font-normal">
                        {descriptionText}
                      </p>

                      <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                          Explore Tickets
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-sky-500 flex items-center justify-center transition-all duration-300 text-white">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BrowseCategories;