import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import concert from "../assets/concert.jpg";
import tech from "../assets/tech.jpg";
import food from "../assets/food.jpg";
import football from "../assets/football.jpg";

const eventList = [
  {
    id: 1,
    image: concert,
    date: "OCT 24",
    badge: "LIVE EVENT",
    category: "MUSIC",
    title: "Stellar Beats Music Festival",
    location: "Grand Horizon Arena, Los Angeles",
    rating: "4.9",
    price: 1500,
  },
  {
    id: 2,
    image: tech,
    date: "OCT 22",
    badge: "CONFIRMED",
    category: "EVENTS",
    title: "Future Tech Summit",
    location: "Convention Center, New York",
    rating: "4.8",
    price: 1800,
  },
  {
    id: 3,
    image: food,
    date: "SEP 14",
    badge: "FESTIVAL",
    category: "EVENTS",
    title: "Metro Food Expo",
    location: "Central Square, City",
    rating: "4.8",
    price: 2000,
  },
  {
    id: 4,
    image: football,
    date: "OCT 11",
    badge: "SPORTS",
    category: "SPORTS",
    title: "Championship Finals",
    location: "Grand Arena, Chicago",
    rating: "4.9",
    price: 3200,
  },
];

const categoryTheme = {
  MUSIC: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  EVENTS: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  SPORTS: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Popular = () => {
  const navigate = useNavigate();

  const handleBooking = (item) => {
    const rawToken =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    const hasValidToken =
      Boolean(rawToken) &&
      rawToken !== "undefined" &&
      rawToken !== "null" &&
      rawToken.trim().length > 10;

    let hasValidUser = false;
    try {
      const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
        const parsed = JSON.parse(rawUser);
        hasValidUser = Boolean(parsed && !parsed.isGuest && (parsed._id || parsed.id || parsed.email));
      }
    } catch {
      hasValidUser = false;
    }

    const isAuthenticated = hasValidToken && hasValidUser;
    const cat = (item.category || "").toLowerCase();
    const isSeatBased = ["bus", "flight", "movie", "cinema", "train"].includes(cat);

    const targetRoute = isSeatBased ? "/book/seats" : "/bookings";
    const targetState = isSeatBased
      ? { item }
      : {
          event: item,
          ticketType: "Standard Entry",
          ticketPrice: Number(item.price),
          totalPrice: Number(item.price),
          quantity: 1,
        };

    if (isAuthenticated) {
      navigate(targetRoute, { state: targetState });
    } else {
      navigate("/login", {
        replace: true,
        state: { redirectTo: targetRoute, redirectState: targetState },
      });
    }
  };

  return (
    <section className="relative w-full bg-[#050913] text-white py-14 sm:py-20 border-b border-slate-800/80 overflow-hidden font-sans">
      {/* Background Lighting Aura */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] mb-3">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>TOP PICKS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Popular Near You
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Curated tickets matched specifically to your lifestyle and travel preferences.
            </p>
          </div>

          <button
            onClick={() => navigate("/browsing")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-500/50 backdrop-blur-md text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
          >
            <span>See All</span>
            <FaArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Responsive Grid & Touch Carousel on Mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {eventList.map((item) => {
            const badgeClass =
              categoryTheme[item.category] || "bg-slate-800/80 text-slate-300 border-slate-700/60";

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group w-[80vw] max-w-[290px] sm:w-auto shrink-0 sm:shrink snap-center flex flex-col rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/10 hover:border-sky-500/50 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all duration-300 overflow-hidden"
              >
                {/* Inner Card Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between">
                  {/* Image & Overlay */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-black/30 pointer-events-none" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-white bg-black/60 backdrop-blur-md border border-white/15 shadow-sm">
                        {item.date}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-white bg-sky-500/90 backdrop-blur-md border border-sky-400/30 shadow-sm uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-4.5 flex flex-col flex-1 justify-between gap-3.5">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${badgeClass}`}>
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">
                          <FaStar className="w-3 h-3 fill-amber-400 shrink-0" />
                          <span>{item.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1 group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                        <FaMapMarkerAlt className="shrink-0 text-sky-400 text-[11px]" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    {/* Footer / Price & Button */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                          Starts at
                        </span>
                        <h4 className="font-black text-sm sm:text-base text-white tracking-tight">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBooking(item)}
                        className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-sky-500/25 cursor-pointer"
                      >
                        <span>Book</span>
                        <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Popular;