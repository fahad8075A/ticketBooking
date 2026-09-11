import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import concert from "../assets/concert.jpg";
import tech from "../assets/tech.jpg";
import food from "../assets/food.jpg";
import football from "../assets/football.jpg";
import { useNavigate } from "react-router-dom";

const event = [
  {
    id: 1,
    image: concert,
    date: "OCT 24",
    badge: "LIVE EVENT",
    category: "MUSIC",
    title: "Stellar Beats Music Festival",
    location: "Grand Horizon Arena, Los Angeles",
    rating: "4.9",
    price: "₹1500.00",
  },
  {
    id: 2,
    image: tech,
    date: "OCT 22",
    badge: "CONFIRMED EVENT",
    category: "EVENTS",
    title: "Future Tech Summit 2024",
    location: "Grand Convention Center, New York",
    rating: "4.8",
    price: "₹1800.00",
  },
  {
    id: 3,
    image: food,
    date: "SEP 14",
    badge: "FESTIVAL",
    category: "EVENTS",
    title: "Metro Food Expo 2024",
    location: "Central Square, City",
    rating: "4.8",
    price: "₹2000.00",
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
    price: "₹3200.00",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Shorter stagger prevents queue build-up
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const Popular = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 md:mb-10 gap-3">
        <div>
          <span className="text-blue-600 font-semibold text-xs sm:text-sm uppercase tracking-widest block mb-1">
            Top Picks
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 tracking-tight">
            Popular Near You
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
            High-key tickets matched specifically to your lifestyle preferences.
          </p>
        </div>

        <button 
          onClick={() => navigate("/browse")}
          className="group inline-flex items-center gap-1.5 text-sm sm:text-base md:text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          See All 
          <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
        </button>
      </div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }} // Triggers instantly when 5% visible
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
      >
        {event.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
          >
            {/* Image */}
            <div className="relative h-48 sm:h-52 md:h-56 w-full overflow-hidden shrink-0 bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
              />
              
              {/* Badges without backdrop-blur */}
              <span className="absolute top-3 left-3 bg-white text-gray-800 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                {item.date}
              </span>

              <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                {item.badge}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-orange-500 text-xs sm:text-sm font-semibold">
                    <FaStar className="shrink-0" />
                    <span className="text-gray-700">{item.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-150">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm mt-1.5">
                  <FaMapMarkerAlt className="shrink-0 text-gray-400" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                <h4 className="font-bold text-base sm:text-lg text-gray-900">
                  {item.price}
                </h4>

                <button
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl cursor-pointer"
                  onClick={() => {
                    navigate("/bookings", {
                      state: { event: item },
                    });
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Popular;