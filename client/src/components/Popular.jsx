import React from "react";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import concert from "../assets/concert.jpg";
import tech from "../assets/tech.jpg";
import food from "../assets/food.jpg";
import football from "../assets/football.jpg";

const eventList = [
  {
    id: 1,
    image: concert,
    date: "OCT 24",
    badge: "Live Event",
    category: "Music",
    title: "Stellar Beats Music Festival",
    location: "Grand Horizon Arena, Los Angeles",
    rating: "4.9",
    price: 1500,
  },
  {
    id: 2,
    image: tech,
    date: "OCT 22",
    badge: "Confirmed",
    category: "Events",
    title: "Future Tech Summit",
    location: "Convention Center, New York",
    rating: "4.8",
    price: 1800,
  },
  {
    id: 3,
    image: food,
    date: "SEP 14",
    badge: "Festival",
    category: "Events",
    title: "Metro Food Expo",
    location: "Central Square, City",
    rating: "4.8",
    price: 2000,
  },
  {
    id: 4,
    image: football,
    date: "OCT 11",
    badge: "Sports",
    category: "Sports",
    title: "Championship Finals",
    location: "Grand Arena, Chicago",
    rating: "4.9",
    price: 3200,
  },
];

const Popular = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

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
      const rawUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
        const parsed = JSON.parse(rawUser);
        hasValidUser = Boolean(
          parsed && !parsed.isGuest && (parsed._id || parsed.id || parsed.email)
        );
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
    <section
      className={`relative w-full py-16 sm:py-24 border-b transition-colors duration-300 font-sans select-none overflow-hidden ${
        isDarkMode
          ? "bg-zinc-950 text-zinc-100 border-zinc-800"
          : "bg-zinc-50 text-zinc-900 border-zinc-200"
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 gap-4">
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Trending
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-semibold tracking-tight mt-1 ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Popular events near you
            </h2>
            <p
              className={`text-sm mt-1 max-w-xl ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Handpicked concerts, matches, and expos open for immediate reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/browsing")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap active:scale-95 ${
              isDarkMode
                ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200"
                : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-800 shadow-sm"
            }`}
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {eventList.map((item) => (
            <div
              key={item.id}
              className={`group w-[80vw] max-w-[290px] sm:w-auto shrink-0 sm:shrink snap-center flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
              }`}
            >
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-800">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out select-none"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/60 text-zinc-200 border border-white/15 backdrop-blur-sm">
                    {item.date}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-zinc-950 shadow-sm">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-[11px] font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <h3
                    className={`font-semibold text-base line-clamp-1 transition-colors ${
                      isDarkMode
                        ? "text-white group-hover:text-zinc-200"
                        : "text-zinc-950 group-hover:text-zinc-800"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <div
                    className={`flex items-center gap-1.5 text-xs mt-1.5 ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    <MapPin className="shrink-0 w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                <div
                  className={`flex justify-between items-center pt-3 border-t ${
                    isDarkMode ? "border-zinc-800" : "border-zinc-100"
                  }`}
                >
                  <div>
                    <span
                      className={`block text-[10px] uppercase font-medium tracking-wider ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Starting from
                    </span>
                    <h4
                      className={`font-semibold text-base tracking-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBooking(item)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                      isDarkMode
                        ? "bg-white hover:bg-zinc-200 text-zinc-950"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
                    }`}
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Popular;