import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plane,
  Bus,
  Train,
  Film,
  Sparkles,
  MapPin,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_CATEGORIES = [
  { label: "All Events", key: "ALL", icon: Sparkles },
  { label: "Flights", key: "FLIGHT", icon: Plane },
  { label: "Buses", key: "BUS", icon: Bus },
  { label: "Trains", key: "TRAIN", icon: Train },
  { label: "Movies", key: "MOVIE", icon: Film },
];

const FAMOUS_DESTINATIONS = [
  {
    id: 1,
    city: "Paris",
    country: "France",
    place: "Eiffel Tower & Louvre",
    tag: "Romantic & Art",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    city: "Tokyo",
    country: "Japan",
    place: "Shibuya Crossing & Shinjuku",
    tag: "Megacity & Culture",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    city: "New York",
    country: "USA",
    place: "Times Square & Manhattan",
    tag: "Broadway & Skyline",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    city: "London",
    country: "United Kingdom",
    place: "Big Ben & Tower Bridge",
    tag: "Royal Heritage",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    city: "Dubai",
    country: "UAE",
    place: "Burj Khalifa & Marina",
    tag: "Luxury & Safari",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    city: "Rome",
    country: "Italy",
    place: "The Colosseum & Vatican",
    tag: "Ancient Wonder",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    city: "Singapore",
    country: "Singapore",
    place: "Marina Bay Sands & Gardens",
    tag: "Futuristic Garden",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    city: "Bangkok",
    country: "Thailand",
    place: "Grand Palace & Wat Arun",
    tag: "Street Food & Temples",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 9,
    city: "Sydney",
    country: "Australia",
    place: "Opera House & Harbour Bridge",
    tag: "Coastal Iconic",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 10,
    city: "Rio de Janeiro",
    country: "Brazil",
    place: "Christ the Redeemer & Copacabana",
    tag: "Carnival & Beaches",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.28 },
      scale: { duration: 0.3 },
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.22 },
      scale: { duration: 0.22 },
    },
  }),
};

// Generates persistent background ambient particles
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: (i % 3) + 2,
  left: `${(i * 5.5 + 3) % 94}%`,
  top: `${(i * 7.3 + 5) % 88}%`,
  duration: 4 + (i % 5) * 1.5,
  delay: (i % 4) * 0.7,
}));

const Hero = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const [[currentIndex, direction], setPage] = useState([0, 1]);

  const currentDestination = FAMOUS_DESTINATIONS[currentIndex];

  const paginate = (newDirection) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = FAMOUS_DESTINATIONS.length - 1;
    if (nextIndex >= FAMOUS_DESTINATIONS.length) nextIndex = 0;
    setPage([nextIndex, newDirection]);
  };

  const handleCardClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const cardWidth = rect.width;

    if (clickX < cardWidth / 2) {
      paginate(-1);
    } else {
      paginate(1);
    }
  };

  const handleCategoryClick = (key) => {
    if (onSelectCategory) {
      onSelectCategory(key);
    } else {
      navigate(`/browsing?category=${key}`);
    }
  };

  const handleBookCurrentDestination = (e) => {
    e.stopPropagation();
    navigate(`/browsing?search=${encodeURIComponent(currentDestination.city)}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#07090e] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 font-sans select-none">
      
      {/* ================= BACKGROUND ANIMATIONS ================= */}

      {/* 1. Drifting Aurora Glow Orbs */}
      <motion.div
        animate={{
          x: [-60, 40, -60],
          y: [-30, 50, -30],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 left-1/4 w-[38rem] h-[38rem] rounded-full bg-sky-500/15 blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [50, -40, 50],
          y: [40, -30, 40],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-20 w-[32rem] h-[32rem] rounded-full bg-indigo-600/15 blur-[150px] pointer-events-none"
      />

      {/* 2. Floating Star Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{
              opacity: [0.15, 0.75, 0.15],
              y: [-15, 15, -15],
              x: [-8, 8, -8],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
            }}
            className="absolute rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          />
        ))}
      </div>

      {/* 3. Orbiting Satellite Rings around the main section */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-sky-500/10 pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-indigo-400/5 pointer-events-none"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_14px_#818cf8]" />
      </motion.div>

      {/* 4. World Map Texture Glow */}
      <div
        className="absolute inset-0 opacity-15 bg-center bg-no-repeat bg-contain pointer-events-none"
        style={{
          backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")`,
          filter: "invert(1) drop-shadow(0 0 16px rgba(56,189,248,0.45))",
        }}
      />

      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Top Tagline Pill */}
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-extrabold text-sky-400 mb-4 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          SEAMLESS TICKET RESERVATIONS
        </span>

        {/* Top Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight sm:leading-tight">
          The World is Waiting. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.3)]">
            Let's Go
          </span>
        </h1>

        {/* Description */}
        <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
          Your entire trip, simplified. Find, compare, and book movies, flights,
          trains, buses, and live events instantly—all in one seamless experience.
        </p>

        {/* Quick Category Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6 max-w-2xl">
          {QUICK_CATEGORIES.map(({ label, key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCategoryClick(key)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f1420]/80 hover:bg-sky-500/20 text-zinc-300 hover:text-sky-300 border border-zinc-800 hover:border-sky-400/50 backdrop-blur-md text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Icon className="w-3.5 h-3.5 text-sky-400" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Famous Destinations Card Slider */}
        <div className="relative w-full max-w-md sm:max-w-xl mt-12 flex flex-col items-center">
          <div className="flex items-center justify-between w-full px-2 mb-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-extrabold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>10 Famous Destinations</span>
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              #{currentDestination.id} / 10
            </span>
          </div>

          <div className="absolute inset-0 bg-sky-500/15 blur-3xl rounded-3xl scale-95 pointer-events-none" />

          {/* Interactive Showcase Card (Click left = Prev, Click right = Next) */}
          <div
            onClick={handleCardClick}
            className="group relative z-20 w-full rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/90 cursor-pointer overflow-hidden active:scale-[0.99] transition-transform"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] max-h-64 sm:max-h-80 w-full bg-slate-950 flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentDestination.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentDestination.image}
                    alt={currentDestination.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/95 via-black/25 to-transparent pointer-events-none" />

                  {/* Card Bottom Details & Action */}
                  <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2 z-20">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                          POPULAR
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-sky-300 text-[10px] font-semibold">
                          {currentDestination.tag}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                        {currentDestination.city}, {currentDestination.country}
                      </h3>
                      <p className="text-xs text-zinc-300 drop-shadow-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                        {currentDestination.place}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleBookCurrentDestination}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition shadow-lg shadow-sky-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Hint */}
          <p className="text-[11px] text-zinc-500 mt-2.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            Click left side for previous • Click right side for next
          </p>

          {/* 10-Item Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-4 mb-6">
            {FAMOUS_DESTINATIONS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPage([idx, idx > currentIndex ? 1 : -1])}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 bg-sky-500 shadow-sm shadow-sky-500/50"
                    : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Primary Call to Action Button */}
        <div className="w-full max-w-xs sm:max-w-sm mt-2">
          <button
            type="button"
            onClick={() => navigate("/browsing")}
            className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;