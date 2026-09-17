import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Clapperboard, Mic2, Flame } from "lucide-react";
import CategoryFilter from "../components/CategoryFilter";
import EventsList from "../components/Event";
import { useTheme } from "../context/ThemeContext";

const mockSpotlights = [
  {
    id: 1,
    badge: "Now in theatres",
    category: "MOVIES",
    title: "Bethlehem Kudumba Unit",
    description: "The narrative brilliantly dissects the nosy comedy of local church committees.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    badge: "Live Concert",
    category: "EVENTS",
    title: "Indie Acoustic Night",
    description: "An unplugged evening featuring top regional singer-songwriters.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    badge: "Trending",
    category: "EVENTS",
    title: "Global Beats Arena Tour",
    description: "High-energy stadium performance with immersive visuals and sound.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  },
];

const Browse = () => {
  const { isDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") || "ALL").toUpperCase();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setSelectedCategory(urlCategory.toUpperCase());
    } else {
      setSelectedCategory("ALL");
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    const upperCat = (category || "ALL").toUpperCase();
    setSelectedCategory(upperCat);
    if (upperCat === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ category: upperCat.toLowerCase() });
    }
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-300 font-sans select-none overflow-x-hidden ${
        isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Subtle top ambient glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 sm:h-96 blur-3xl pointer-events-none transition-opacity duration-300 ${
          isDarkMode
            ? "bg-gradient-to-b from-sky-500/10 via-transparent to-transparent opacity-100"
            : "bg-gradient-to-b from-sky-400/20 via-transparent to-transparent opacity-60"
        }`}
      />

      {/* Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8 text-left">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Explore
          </span>
          <h1
            className={`text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-1 ${
              isDarkMode ? "text-white" : "text-zinc-950"
            }`}
          >
            Browse all tickets & routes
          </h1>
          <p
            className={`mt-1.5 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed ${
              isDarkMode ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Find scheduled flights, express buses, cross-country trains,
            movies, and live arena events with instant seat availability.
          </p>
        </header>

        {/* Explore Quick-Access Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-md">
          <button
            type="button"
            onClick={() => handleCategoryChange(selectedCategory === "MOVIES" ? "ALL" : "MOVIES")}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left ${
              selectedCategory === "MOVIES"
                ? isDarkMode
                  ? "bg-zinc-900 border-purple-500/40 ring-1 ring-purple-500/30"
                  : "bg-white border-purple-300 ring-2 ring-purple-500/20 shadow-sm"
                : isDarkMode
                ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                : "bg-white/70 border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDarkMode ? "bg-purple-950/60 text-purple-400" : "bg-purple-100 text-purple-600"
              }`}
            >
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Movies</p>
              <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                Cinema shows
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange(selectedCategory === "EVENTS" ? "ALL" : "EVENTS")}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left ${
              selectedCategory === "EVENTS"
                ? isDarkMode
                  ? "bg-zinc-900 border-amber-500/40 ring-1 ring-amber-500/30"
                  : "bg-white border-amber-300 ring-2 ring-amber-500/20 shadow-sm"
                : isDarkMode
                ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                : "bg-white/70 border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDarkMode ? "bg-amber-950/60 text-amber-400" : "bg-amber-100 text-amber-600"
              }`}
            >
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Events</p>
              <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                Concerts & live
              </p>
            </div>
          </button>
        </div>

        {/* Spotlight Mobile-Friendly Carousel */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold tracking-tight">In the spotlight</h2>
            <span className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              Swipe to explore
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {mockSpotlights.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCategoryChange(item.category)}
                className="snap-center shrink-0 w-[80%] max-w-[280px] sm:w-64 cursor-pointer group"
              >
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white">
                    {item.badge}
                  </div>

                  <div className="absolute top-3 right-3 w-7 h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs uppercase tracking-wider text-zinc-300 font-medium">
                      {item.category}
                    </p>
                    <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                  </div>
                </div>

                <p
                  className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Category Filter Bar */}
        <div className="mb-6 sm:mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
          />
        </div>

        {/* Listings Section */}
        <section aria-label="Available events and tickets">
          <EventsList selectedCategory={selectedCategory} />
        </section>
      </main>
    </div>
  );
};

export default Browse;