import React, { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import EventsList from "../components/Event"; // or components/EventsList

const Browse = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Background Decorators */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle geometric dot matrix */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#94A3B8 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[55rem] h-[28rem] rounded-full bg-gradient-to-tr from-sky-200/50 via-blue-100/40 to-indigo-200/50 blur-[110px]" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute -bottom-20 -right-24 w-[32rem] h-[32rem] rounded-full bg-blue-100/40 blur-[130px]" />
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title & Subtitle */}
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Browse Events
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Discover workshops, conferences, and meetups happening near you.
          </p>
        </header>

        {/* Category Pills */}
        <div className="mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
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