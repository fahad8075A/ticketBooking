import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

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

const Hero = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentDestination = FAMOUS_DESTINATIONS[currentIndex];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FAMOUS_DESTINATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? FAMOUS_DESTINATIONS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FAMOUS_DESTINATIONS.length);
  };

  const handleImageTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <section
      className={`relative overflow-hidden py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-300 font-sans select-none ${
        isDarkMode
          ? "bg-zinc-950 text-zinc-100 border-zinc-800"
          : "bg-zinc-50 text-zinc-900 border-zinc-200"
      }`}
    >
      {/* Theme Toggle Button */}
     
      
      {/* Subtle Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 sm:h-96 blur-3xl pointer-events-none transition-opacity duration-300 ${
          isDarkMode
            ? "bg-gradient-to-b from-sky-500/10 via-transparent to-transparent opacity-100"
            : "bg-gradient-to-b from-sky-400/20 via-transparent to-transparent opacity-60"
        }`}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Dynamic Responsive Headline */}
        <h1
          className={`text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl leading-[1.15] sm:leading-[1.1] transition-colors ${
            isDarkMode ? "text-white" : "text-zinc-950"
          }`}
        >
          Book travel and entertainment without the friction.
        </h1>

        <p
          className={`mt-3 sm:mt-4 text-xs sm:text-sm md:text-base max-w-md sm:max-w-lg leading-relaxed transition-colors px-2 ${
            isDarkMode ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          Tap the left side to navigate back, or right side to explore forward.
        </p>

        {/* Destination Touch Slider */}
        <div
          className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl mt-8 sm:mt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            onClick={handleImageTap}
            className={`relative rounded-2xl overflow-hidden border shadow-lg sm:shadow-xl aspect-[4/3] sm:aspect-[16/9] md:aspect-[2/1] cursor-pointer transition-colors ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900 shadow-black/40"
                : "border-zinc-200 bg-white shadow-zinc-200/50"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDestination.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <img
                  src={currentDestination.image}
                  alt={currentDestination.city}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                {/* Card Content & Action Button */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 z-10 text-left">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-black/60 text-zinc-200 border border-white/20 backdrop-blur-sm mb-1.5 sm:mb-2">
                      {currentDestination.tag}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-snug">
                      {currentDestination.city},{" "}
                      <span className="text-zinc-300 font-normal text-sm sm:text-base">
                        {currentDestination.country}
                      </span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-300 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{currentDestination.place}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/browsing?search=${encodeURIComponent(
                          currentDestination.city
                        )}`
                      );
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md active:scale-95"
                  >
                    <span>View bookings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator & Counter */}
          <div className="flex items-center justify-between mt-3 px-1">
            <span
              className={`text-[11px] sm:text-xs font-mono transition-colors ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(FAMOUS_DESTINATIONS.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {FAMOUS_DESTINATIONS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1 sm:h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? isDarkMode
                        ? "w-4 sm:w-5 bg-white"
                        : "w-4 sm:w-5 bg-zinc-900"
                      : isDarkMode
                      ? "w-1.5 sm:w-2 bg-zinc-800 hover:bg-zinc-600"
                      : "w-1.5 sm:w-2 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;