import React, { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import EventsList from "../components/Event"; // or components/EventsList

const Browse = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden">
      {/* Background Decorators with Ambient Floating Animation */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Subtle geometric dot matrix */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#94A3B8 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[55rem] h-[28rem] rounded-full bg-gradient-to-tr from-sky-200/50 via-blue-100/40 to-indigo-200/50 blur-[110px] animate-pulse duration-1000" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-indigo-100/40 blur-[120px] animate-pulse duration-700" />
        <div className="absolute -bottom-20 -right-24 w-[32rem] h-[32rem] rounded-full bg-blue-100/40 blur-[130px] animate-pulse duration-1000" />

        {/* Floating Icons Layer */}
        {/* Icon 1: Calendar (Top Left) */}
        <div className="absolute top-16 left-[8%] text-indigo-400/25 animate-float-slow">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.253 3.75m-18 0h19.5m-19.5 0v13.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V7.5m-19.5 0h19.5" />
          </svg>
        </div>

        {/* Icon 2: Sparkle (Top Right) */}
        <div className="absolute top-28 right-[12%] text-sky-400/30 animate-float-slower [animation-delay:-4s]">
          <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>

        {/* Icon 3: Ticket (Mid Left) */}
        <div className="absolute top-1/2 left-[5%] text-blue-400/20 animate-float-medium [animation-delay:-7s]">
          <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </div>

        {/* Icon 4: Compass (Mid Right) */}
        <div className="absolute top-[58%] right-[8%] text-indigo-400/25 animate-float-slow [animation-delay:-11s]">
          <svg className="w-11 h-11" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75l-4.5 1.5 1.5 4.5 4.5-1.5-1.5-4.5z" />
          </svg>
        </div>

        {/* Icon 5: Musical Note / Stage Mic (Bottom Left) */}
        <div className="absolute bottom-20 left-[14%] text-sky-400/20 animate-float-slower [animation-delay:-2s]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a.75.75 0 00.55-.722V7.125M9 11.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66A.75.75 0 009 13.064V9.75" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-8 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Browse Events
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Discover workshops, conferences, and meetups happening near you.
          </p>
        </header>

        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <section
          key={selectedCategory}
          aria-label="Available events"
          className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
        >
          <EventsList selectedCategory={selectedCategory} />
        </section>
      </main>
    </div>
  );
};

export default Browse;