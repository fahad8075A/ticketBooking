import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle, FaStar, FaMapMarkerAlt, FaShareAlt, FaCalendarAlt } from "react-icons/fa";
import mapFallback from "../assets/map.jpg";

// Category-specific metadata schema
const CATEGORY_META = {
  MOVIE: [
    { label: "Duration", key: "duration" },
    { label: "Language", key: "language" },
    { label: "Genre", key: "genre" },
    { label: "Theatre", key: "theatre" },
  ],
  FLIGHT: [
    { label: "Airline", key: "airline" },
    { label: "Departure", key: "departure" },
    { label: "Arrival", key: "arrival" },
    { label: "Travel Time", key: "travelTime" },
  ],
  BUS: [
    { label: "Bus Type", key: "busType" },
    { label: "Departure", key: "departure" },
    { label: "Arrival", key: "arrival" },
    { label: "Seats Left", key: "seats" },
  ],
  TRAIN: [
    { label: "Train No", key: "trainNo" },
    { label: "Coach", key: "coach" },
    { label: "Departure", key: "departure" },
    { label: "Platform", key: "platform" },
  ],
  DEFAULT: [
    { label: "Duration", key: "duration" },
    { label: "Age Limit", key: "age" },
    { label: "Artists / Host", key: "artists" },
    { label: "Capacity", key: "capacity" },
  ],
};

const EventDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const event = state?.event;

  if (!event) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Event Not Found</h1>
        <p className="text-slate-500 mt-2">
          The event details could not be loaded or the link has expired.
        </p>
        <button
          onClick={() => navigate("/browse")}
          className="mt-6 px-6 py-2.5 bg-[#0F4C81] text-white rounded-xl font-semibold hover:bg-[#09365b] transition-colors"
        >
          Back to Browse
        </button>
      </main>
    );
  }

  // Dynamic ticket generation fallback if event lacks tiers
  const ticketTiers = event.ticketTiers || [
    {
      title: "Standard Admission",
      description: "Standard general entry access",
      price: event.price || 1500,
      perks: ["General entry access", "Standard seating/standing area", "Access to amenities"],
      isPopular: false,
    },
    {
      title: "VIP Experience",
      description: "Fast-track priority pass and premium perks",
      price: Math.round((event.price || 1500) * 1.6),
      perks: ["Fast-track dedicated entry", "Reserved premium section", "Complimentary refreshments"],
      isPopular: true,
    },
  ];

  const metaFields = CATEGORY_META[event.category] || CATEGORY_META.DEFAULT;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on FlexiBook!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share dialog
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectTicket = (ticket) => {
    navigate("/bookings", {
      state: {
        event,
        ticketType: ticket.title,
        ticketPrice: ticket.price,
      },
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left / Main Details Column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-80 sm:h-[480px] rounded-2xl object-cover shadow-sm"
            />

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-6 tracking-tight">
              {event.title}
            </h1>

            <p className="flex items-center gap-2 text-slate-500 mt-2 font-medium text-sm sm:text-base">
              <FaMapMarkerAlt className="text-slate-400 shrink-0" />
              <span>{event.location}</span>
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              <span className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {event.category}
              </span>
              {event.rating && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <FaStar className="text-amber-500" />
                  {event.rating}
                </span>
              )}
              {event.date && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <FaCalendarAlt className="text-emerald-500" />
                  {event.date}
                </span>
              )}
            </div>
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">About</h2>
            <p className="text-slate-600 mt-3 leading-relaxed text-sm sm:text-base">
              {event.description}
            </p>
          </div>

          {/* Dynamic Category Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metaFields.map(({ label, key }) => (
              <div
                key={key}
                className="bg-white rounded-xl border-t-4 border-[#0F4C81] shadow-sm border border-slate-100 p-4 text-center"
              >
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  {label}
                </p>
                <h3 className="text-base sm:text-lg font-bold text-[#0F4C81] mt-1.5 truncate">
                  {event[key] || "—"}
                </h3>
              </div>
            ))}
          </div>

          {/* Ticket Tier Cards */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Choose Ticket</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {ticketTiers.map((ticket, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 relative flex flex-col justify-between transition-shadow bg-white ${
                    ticket.isPopular
                      ? "border-2 border-[#0F4C81] shadow-lg"
                      : "border border-slate-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {ticket.isPopular && (
                    <span className="absolute -top-3 right-5 bg-red-600 text-white text-xs px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-[#0F4C81]">{ticket.title}</h3>
                        <p className="text-slate-500 text-sm mt-1">{ticket.description}</p>
                      </div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold shrink-0">
                        ₹{ticket.price}
                      </span>
                    </div>

                    <ul className="space-y-3 mt-6">
                      {ticket.perks.map((perk, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                          <FaCheckCircle className="text-[#0F4C81] shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectTicket(ticket)}
                    className={`w-full py-3 rounded-xl font-semibold mt-8 transition-colors ${
                      ticket.isPopular
                        ? "bg-[#0F4C81] text-white hover:bg-[#09365b]"
                        : "border border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white"
                    }`}
                  >
                    Select Pass
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right / Sticky Sidebar */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          {/* Quick Summary Booking Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Event Date
            </h3>
            <p className="text-lg font-bold text-slate-900 mt-1">{event.date}</p>

            <h3 className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-5">
              Venue
            </h3>
            <p className="font-medium text-slate-800 mt-1 text-sm">{event.location}</p>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-sm text-slate-500 font-medium">Starting from</span>
              <span className="text-3xl font-extrabold text-[#0F4C81]">₹{event.price}</span>
            </div>

            <button
              onClick={() => handleSelectTicket(ticketTiers[0])}
              className="w-full mt-5 bg-[#0F4C81] hover:bg-[#09365b] text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm"
            >
              Continue Booking →
            </button>
          </div>

          {/* Venue Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Venue Map</h3>
              <FaMapMarkerAlt className="text-[#0F4C81]" />
            </div>

            <img src={mapFallback} alt="Venue Map" className="w-full h-48 object-cover" />

            <div className="p-5">
              <p className="text-xs text-slate-500 line-clamp-2">{event.location}</p>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      event.location
                    )}`,
                    "_blank"
                  )
                }
                className="w-full mt-4 border border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Get Directions
              </button>
            </div>
          </div>

          {/* Referral / Share */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-base font-bold text-slate-900">Invite Friends</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Share this link with your friends to book seats together.
            </p>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={handleShare}
                aria-label="Share"
                className="w-11 h-11 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
              >
                <FaShareAlt className="text-sm" />
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-[#0F4C81] hover:bg-[#09365b] text-white rounded-xl font-semibold text-sm py-2.5 transition-colors"
              >
                {copied ? "Copied!" : "Share Link"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetails;