import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LuUsers,
  LuTicket,
  LuTrendingUp,
  LuRefreshCw,
  LuClock,
  LuArrowUpRight,
  LuClapperboard,
  LuFilm,
  LuSparkles,
} from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Reusable smooth counter component with ease-out animation
const AnimatedCounter = ({ value = 0, duration = 1600, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const target = Number(value) || 0;
    const initial = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Smooth ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(initial + (target - initial) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");
  const userEmail = localStorage.getItem("userEmail");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-email": userEmail || "",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch dashboard statistics");
      }

      setStats(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide text-slate-500 animate-pulse">
          Loading live cinema feed...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-slate-700 max-w-xl mx-auto my-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 mx-auto flex items-center justify-center mb-3 ring-8 ring-rose-50">
          <FiAlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-1">
          Failed to Load Dashboard
        </h3>
        <p className="text-xs text-rose-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  const counts = stats?.counts || {};
  const recentUsers = stats?.recentUsers || [];
  const recentBookings = stats?.recentBookings || [];
  const trends = stats?.trends || [];
  const maxTrendSale = trends.length
    ? Math.max(...trends.map((t) => t.totalSales), 1)
    : 1;

  return (
    <div className="space-y-6">
      {/* 1. Live Continuous Marquee Strip */}
      <div className="w-full bg-sky-50/80 border border-sky-100 rounded-xl px-4 py-2 flex items-center gap-3 overflow-hidden shadow-sm">
        <div className="flex items-center gap-1.5 text-sky-600 font-bold text-xs uppercase tracking-wider shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
          </span>
          Live Feed:
        </div>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <p className="inline-block text-xs font-medium text-slate-600 animate-[marquee_25s_linear_infinite]">
            🎬 Real-time Box Office Sync Active • 🎟️ Total Tickets Sold:{" "}
            <span className="text-sky-600 font-semibold">
              <AnimatedCounter value={counts.bookings || 0} />
            </span>{" "}
            • 🍿 Registered Viewers:{" "}
            <span className="text-sky-600 font-semibold">
              <AnimatedCounter value={counts.users || 0} />
            </span>{" "}
            • 💰 Gross Revenue:{" "}
            <span className="text-sky-600 font-semibold">
              <AnimatedCounter value={counts.revenue || 0} prefix="₹" />
            </span>{" "}
            • ⚡ Automated booking stream connected
          </p>
        </div>
      </div>

      {/* 2. Header Banner with Spinning Projector Reel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-600 border border-sky-200">
              <LuFilm className="w-4 h-4 animate-[spin_6s_linear_infinite]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1">
              Live Box Office Central
              <LuSparkles className="w-3 h-3 text-sky-400 animate-bounce" />
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time box office performance metrics, movie listings, and ticket traffic.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-200 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition self-start sm:self-auto active:scale-95 cursor-pointer"
        >
          <LuRefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-slate-400 group-hover:text-sky-600" />
          Refresh Stats
        </button>
      </div>

      {/* 3. KPI Cards with Ambient Moving Elements & Number Count-Up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 text-sky-600/5 group-hover:text-sky-600/10 transition-colors pointer-events-none">
            <TbCurrencyRupee className="w-28 h-28 animate-[pulse_3s_ease-in-out_infinite]" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <TbCurrencyRupee className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
              <AnimatedCounter value={counts.revenue || 0} prefix="₹" duration={1800} />
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Avg:{" "}
              <AnimatedCounter
                value={counts.averageOrderValue || 0}
                prefix="₹"
                duration={1500}
              />
            </span>
            <span className="text-emerald-600 flex items-center font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              Active
            </span>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 text-sky-600/5 group-hover:text-sky-600/10 transition-colors pointer-events-none">
            <LuTicket className="w-28 h-28 animate-[pulse_3.5s_ease-in-out_infinite]" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tickets Sold
              </span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <LuTicket className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
              <AnimatedCounter value={counts.bookings || 0} duration={1600} />
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              to="/admin/bookings"
              className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 group/link"
            >
              View bookings
              <LuArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Registered Viewers */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 text-sky-600/5 group-hover:text-sky-600/10 transition-colors pointer-events-none">
            <LuUsers className="w-28 h-28 animate-[pulse_4s_ease-in-out_infinite]" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Registered Viewers
              </span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <LuUsers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
              <AnimatedCounter value={counts.users || 0} duration={1600} />
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              to="/admin/users"
              className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 group/link"
            >
              Manage accounts
              <LuArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Movies & Shows */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 text-sky-600/5 group-hover:text-sky-600/10 transition-colors pointer-events-none">
            <LuClapperboard className="w-28 h-28 animate-[pulse_4.5s_ease-in-out_infinite]" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Movies & Shows
              </span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <LuClapperboard className="w-4 h-4 animate-bounce duration-1000" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
              <AnimatedCounter value={counts.events || 0} duration={1400} />{" "}
              <span className="text-sm font-normal text-slate-400">
                / <AnimatedCounter value={counts.categories || 0} duration={1200} /> genres
              </span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              to="/admin/events"
              className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 group/link"
            >
              Manage showtimes
              <LuArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Monthly Revenue Performance (Animated Bars) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-sky-100/40 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              Monthly Box Office Revenue
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Gross ticket sales and cinema performance across 2026
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-600 border border-sky-100 rounded-lg">
            Fiscal Year 2026
          </span>
        </div>

        {trends.length === 0 ? (
          <div className="h-44 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
            No booking volume recorded yet for this period.
          </div>
        ) : (
          <div className="h-48 flex items-end gap-3 pt-6 px-2 relative z-10">
            {trends.map((item, idx) => {
              const heightPercent = Math.max(
                Math.round((item.totalSales / maxTrendSale) * 100),
                8
              );
              const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
              ];
              const monthLabel = monthNames[item.month - 1] || `M${item.month}`;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg transition-all duration-500 group-hover:from-sky-600 group-hover:to-sky-500 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/25 animate-[pulse_2s_ease-in-out_infinite]" />
                    </div>
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] text-white py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap z-20">
                      ₹{item.totalSales.toLocaleString("en-IN")} ({item.bookingCount} bookings)
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-sky-600 transition">
                    {monthLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Live Streams: Recent Bookings & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <LuTicket className="w-4 h-4 text-sky-500" /> Live Ticket Stream
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            </h3>
            <Link to="/admin/bookings" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">
              See all
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No recent reservations logged.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:border-sky-200 hover:bg-sky-50/30 transition-all duration-200"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <LuFilm className="w-3 h-3 text-sky-500 shrink-0 animate-[spin_8s_linear_infinite]" />
                      {b.eventId?.title || "Movie Show Ticket"}
                    </p>
                    <p className="text-[11px] text-slate-500">{b.customerEmail || b.userId?.email || "Guest"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      ₹{(b.totalPrice || b.totalAmount || 0).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mt-0.5 ${
                        b.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {b.status || "confirmed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Users */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <LuUsers className="w-4 h-4 text-sky-500" /> Viewer Registrations
            </h3>
            <Link to="/admin/users" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">
              See all
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No registered user profiles found.</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:border-sky-200 hover:bg-sky-50/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {(u.name || u.email || "U").charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{u.name || "User"}</p>
                      <p className="text-[11px] text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-sky-100 text-sky-700 border border-sky-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200/60"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                      <LuClock className="w-3 h-3" />
                      {new Date(u.createdAt || Date.now()).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;