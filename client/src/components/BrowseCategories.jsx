import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaTrain, FaTicketAlt, FaBus, FaFilm } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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

const DEFAULT_DESCRIPTIONS = {
  flights: "Global destinations at your fingertips.",
  trains: "Discover scenic routes with every journey.",
  events: "Unforgettable live experiences around you.",
  bus: "Affordable city-to-city express rides.",
  movie: "Catch the latest blockbusters on big screens.",
};

const resolveCategoryImage = (imageField, normalizedKey) => {
  if (!imageField) return ASSET_IMAGE_MAP[normalizedKey] || flightFallback;
  if (imageField.startsWith("http://") || imageField.startsWith("https://")) return imageField;
  if (imageField.startsWith("/")) return imageField;
  const cleanKey = imageField.replace(/\.[^/.]+$/, "").toLowerCase().trim();
  return ASSET_IMAGE_MAP[cleanKey] || ASSET_IMAGE_MAP[normalizedKey] || flightFallback;
};

const getCategoryIcon = (key) => {
  const props = { className: "w-3.5 h-3.5" };
  switch (key) {
    case "flight":
    case "flights":
    case "plane":
      return <FaPlane {...props} />;
    case "train":
    case "trains":
      return <FaTrain {...props} />;
    case "bus":
      return <FaBus {...props} />;
    case "movie":
      return <FaFilm {...props} />;
    case "event":
    case "events":
      return <MdEvent {...props} />;
    default:
      return <FaTicketAlt {...props} />;
  }
};

const BrowseCategories = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error(`Failed to load categories (Status: ${res.status})`);
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
    <section
      className={`relative w-full py-12 sm:py-16 md:py-24 border-b transition-colors duration-300 font-sans select-none overflow-hidden ${
        isDarkMode
          ? "bg-zinc-950 text-zinc-100 border-zinc-800"
          : "bg-zinc-50 text-zinc-900 border-zinc-200"
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Categories
            </span>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mt-1 ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Browse by transport & events
            </h2>
            <p
              className={`text-xs sm:text-sm mt-1 max-w-xl ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Select an option below to explore real-time availability and routes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/browsing")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
              isDarkMode
                ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200"
                : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-800 shadow-sm"
            }`}
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-hidden">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-72 sm:h-80 md:h-96 w-[80vw] sm:w-auto shrink-0 rounded-2xl border animate-pulse ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-zinc-200/70 border-zinc-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            className={`p-6 rounded-2xl border text-center max-w-xl mx-auto ${
              isDarkMode
                ? "bg-zinc-900 border-red-900/40 text-red-400"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <p className="text-xs sm:text-sm font-medium">Unable to load categories: {error}</p>
          </div>
        )}

        {/* Responsive Grid / Horizontal Snap Reel */}
        {!loading && !error && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar pb-3 sm:pb-0 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((item, index) => {
              const normalizedKey = (
                item.code ||
                item.slug ||
                item.categoryKey ||
                item.name ||
                item.title ||
                ""
              ).toLowerCase();

              const displayName = item.name || item.title || item.label || item.code;
              const finalImageSrc = resolveCategoryImage(item.imageUrl || item.image, normalizedKey);
              const categoryIcon = getCategoryIcon(normalizedKey);

              const badgeText =
                item.badge ||
                (normalizedKey === "flights" || normalizedKey === "flight"
                  ? "Popular"
                  : normalizedKey === "trains" || normalizedKey === "train"
                  ? "High Speed"
                  : null);

              const descriptionText =
                item.subtitle ||
                item.tagline ||
                item.desc ||
                item.description ||
                DEFAULT_DESCRIPTIONS[normalizedKey] ||
                `Explore options in ${displayName}`;

              return (
                <div
                  key={item._id || item.id || item.code || index}
                  onClick={() => navigate(`/browsing?category=${normalizedKey}`)}
                  className={`group relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer snap-center w-[80vw] max-w-[320px] sm:max-w-none sm:w-auto shrink-0 ${
                    isDarkMode
                      ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                      : "border-zinc-200 bg-white hover:border-zinc-300 shadow-sm"
                  } ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <img
                    src={finalImageSrc}
                    alt={displayName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ASSET_IMAGE_MAP[normalizedKey] || flightFallback;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    draggable={false}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                  {badgeText && (
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-black/60 text-zinc-200 border border-white/15 backdrop-blur-sm">
                        {badgeText}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 z-10 flex flex-col justify-end text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-black/60 text-white border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                        {categoryIcon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                        {displayName}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-1 font-normal mb-2.5">
                      {descriptionText}
                    </p>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                      <span className="text-[11px] sm:text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                        Browse listings
                      </span>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 group-hover:bg-white group-hover:text-zinc-950 flex items-center justify-center transition-colors text-white">
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseCategories;