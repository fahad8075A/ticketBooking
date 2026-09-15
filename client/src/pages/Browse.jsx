import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import CategoryFilter from "../components/CategoryFilter";
import EventsList from "../components/Event";

const Browse = () => {
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
    <div className="relative min-h-screen bg-[#050913] text-white overflow-x-hidden font-sans">
      {/* Background Radial Glow & Deep Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* World Map Texture Glow */}
        <div
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")`,
            filter: "invert(1) drop-shadow(0 0 16px rgba(56,189,248,0.45))",
          }}
        />

        {/* Ambient Cyan & Blue Radial Lights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[55rem] h-[28rem] rounded-full bg-sky-500/15 blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute -bottom-20 -right-24 w-[32rem] h-[32rem] rounded-full bg-sky-600/10 blur-[150px]" />
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-24">
        {/* Page Header */}
        <header className="mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em]">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>EXPLORE LISTINGS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Browse All Tickets & Routes
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            Discover scheduled flights, express buses, cross-country trains, movies, and live arena events in real time.
          </p>
        </header>

        {/* Category Filter Bar */}
        <div className="mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
          />
        </div>

        {/* Events Grid */}
        <section aria-label="Available events">
          <EventsList selectedCategory={selectedCategory} />
        </section>
      </main>
    </div>
  );
};

export default Browse;