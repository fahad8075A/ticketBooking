import React from "react";
import hero from "../assets/hero.jpg";
import { FaLocationArrow, FaSearch } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto py-20">
        
        {/* Responsive Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
          Every ticket is a new adventure
        </h1>

        {/* Responsive Subtitle */}
        <p className="text-white/90 mt-4 sm:mt-6 max-w-2xl sm:max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed">
          From blockbusters to cloud-surfing, find and book your next big
          moment in seconds. Effortless, efficient, and ready when you are.
        </p>

      </div>
    </section>
  );
};

export default Hero;




