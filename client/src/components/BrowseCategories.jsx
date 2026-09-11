import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { FaPlane, FaTrain, FaTicketAlt } from "react-icons/fa";
import { MdEvent } from "react-icons/md";

// Local fallback assets
import flightFallback from "../assets/flight.jpg";
import trainFallback from "../assets/train.jpg";
import eventsFallback from "../assets/events.jpg";

// Map backend icon/slug keys to React elements
const ICON_MAP = {
  plane: <FaPlane />,
  train: <FaTrain />,
  event: <MdEvent />,
  default: <FaTicketAlt />,
};

// Fallback images if the backend doesn't provide a public URL
const IMAGE_FALLBACKS = {
  flights: flightFallback,
  trains: trainFallback,
  events: eventsFallback,
};

// Agency-style container stagger setup
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Agency card reveal
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 1, 0.5, 1],
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
        // Replace with your actual backend endpoint or import.meta.env.VITE_API_URL
        const res = await fetch("http://localhost:5000/api/categories");

        if (!res.ok) {
          throw new Error(`Failed to load categories (Status: ${res.status})`);
        }

        const data = await res.json();
        // If your backend responds with { success: true, data: [...] }, use data.data
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4"
      >
        <div>
          <span className="text-blue-600 font-semibold text-xs sm:text-sm uppercase tracking-widest block mb-1">
            Discover
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Browse Categories
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
            Tailored booking experiences for every travel and entertainment need.
          </p>
        </div>
        <button
          onClick={() => navigate("/browse")}
          className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer whitespace-nowrap"
        >
          See All 
          <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </button>
      </motion.div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 sm:h-80 md:h-96 lg:h-[420px] rounded-3xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
          <p className="text-red-700 font-medium">Unable to load categories: {error}</p>
        </div>
      )}

      {/* Dynamic Grid */}
      {!loading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((item, index) => {
            const normalizedSlug = item.slug || item.title?.toLowerCase() || '';
            const categoryImage = item.image || IMAGE_FALLBACKS[normalizedSlug] || flightFallback;
            const categoryIcon = ICON_MAP[item.iconKey] || ICON_MAP[normalizedSlug] || ICON_MAP.default;

            return (
              <motion.div
                key={item._id || item.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => navigate(item.slug ? `/browse?category=${item.slug}` : "/browse")}
                className={`group relative h-72 sm:h-80 md:h-96 lg:h-[420px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer bg-slate-900 ${
                  index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Background Image */}
                <img
                  src={categoryImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 p-6 sm:p-7 md:p-8 text-white w-full z-10">
                  {item.badge && (
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
                      {item.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-2.5 text-xl sm:text-2xl">
                    <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white shrink-0 transition-transform duration-300 group-hover:scale-110">
                      {categoryIcon}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
                    {item.desc || item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

export default BrowseCategories;