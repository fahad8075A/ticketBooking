import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import EventsList from "../components/Event";
import { useTheme } from "../context/ThemeContext";

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
      {/* Subtle top ambient glow matching the rest of the application */}
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