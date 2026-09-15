import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Booking category components
import TrainDetails from "../components/booking/TrainDetails";
import BusSeatBooking from "../components/booking/BusSeatBooking";
import FlightSeatBooking from "../components/booking/FlightSeatBooking";
import MovieSeatBooking from "../components/booking/MovieSeatBooking";
import SportsSeatBooking from "../components/booking/SportsSeatBooking";
import GeneralTicketBooking from "../components/booking/GeneralTicketBooking";

export default function BookingSeatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Retrieve the item from router location state or fallback to an empty object
  const item =
    location.state?.item ||
    location.state?.event ||
    location.state?.listing ||
    location.state?.ticket ||
    null;

  // 2. Query param fallback (e.g., /book-seats?category=sports)
  const queryCategory = searchParams.get("category") || searchParams.get("type") || "";

  // 3. Fallback view if no item state exists
  if (!item && !queryCategory) {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0f1420] border border-zinc-800 flex items-center justify-center text-sky-400 mb-4 shadow-xl">
          <span className="text-2xl font-black">!</span>
        </div>
        <h2 className="text-xl font-black text-white mb-2">No Listing Selected</h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
          Please pick a flight, train, bus, sports match, or event from the browse section to reserve your seats.
        </p>
        <button
          type="button"
          onClick={() => navigate("/browse")}
          className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-sky-500/20 active:scale-95 cursor-pointer"
        >
          Explore Listings
        </button>
      </div>
    );
  }

  // Create an object if query param was passed directly without state
  const activeItem = item || {
    title: searchParams.get("title") || "Selected Event",
    category: queryCategory,
    price: Number(searchParams.get("price") || 499),
    _id: searchParams.get("id") || null,
  };

  // 4. Combine all possible category indicators into a single searchable string
  const rawIdentifier = [
    activeItem.category,
    activeItem.type,
    activeItem.eventType,
    activeItem.subCategory,
    activeItem.genre,
    activeItem.sportType,
    activeItem.title,
    activeItem.name,
    activeItem.description,
    queryCategory,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .trim();

  // --- Dispatch Routing ---

  // 1. SPORTS / STADIUM DISPATCH
  const sportsKeywords = [
    "sport",
    "sports",
    "cricket",
    "football",
    "soccer",
    "match",
    "stadium",
    "ipl",
    "fifa",
    "nba",
    "basketball",
    "tennis",
    "championship",
    "tournament",
    "arena",
    "league",
  ];
  if (sportsKeywords.some((keyword) => rawIdentifier.includes(keyword))) {
    return <SportsSeatBooking item={activeItem} />;
  }

  // 2. FLIGHT
  const flightKeywords = ["flight", "plane", "air", "airline", "indigo", "airways", "aviation"];
  if (flightKeywords.some((keyword) => rawIdentifier.includes(keyword))) {
    return <FlightSeatBooking item={activeItem} />;
  }

  // 3. TRAIN / RAILWAY
  const trainKeywords = ["train", "rail", "railway", "irctc", "express", "superfast"];
  if (trainKeywords.some((keyword) => rawIdentifier.includes(keyword))) {
    return <TrainDetails item={activeItem} />;
  }

  // 4. BUS / COACH
  const busKeywords = ["bus", "coach", "sleeper bus", "volvo", "travels"];
  if (busKeywords.some((keyword) => rawIdentifier.includes(keyword))) {
    return <BusSeatBooking item={activeItem} />;
  }

  // 5. MOVIES / CINEMA
  const movieKeywords = ["movie", "cinema", "film", "theatre", "multiplex", "imax"];
  if (movieKeywords.some((keyword) => rawIdentifier.includes(keyword))) {
    return <MovieSeatBooking item={activeItem} />;
  }

  // 6. DEFAULT FALLBACK: General entry tickets
  return <GeneralTicketBooking item={activeItem} />;
}