import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`relative w-full border-t transition-colors duration-300 font-sans select-none overflow-hidden ${
        isDarkMode
          ? "bg-zinc-950 text-zinc-100 border-zinc-800"
          : "bg-zinc-50 text-zinc-900 border-zinc-200"
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Column */}
          <div className="space-y-3">
            <h2
              className={`text-xl sm:text-2xl font-semibold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              FlexiBook
            </h2>
            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-xs ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Reserve tickets for movies, interstate buses, rail lines, flights,
              and live stadium events with immediate confirmation.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3
              className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Company
            </h3>
            <ul
              className={`space-y-2.5 text-xs sm:text-sm ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              <li>
                <Link
                  to="/"
                  className={`transition-colors flex items-center gap-1 ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/browsing"
                  className={`transition-colors flex items-center gap-1 ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Explore <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className={`transition-colors ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Help & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`transition-colors ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3
              className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Categories
            </h3>
            <ul
              className={`space-y-2.5 text-xs sm:text-sm ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              <li>
                <Link
                  to="/browsing?category=movie"
                  className={`transition-colors ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/browsing?category=bus"
                  className={`transition-colors ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Buses
                </Link>
              </li>
              <li>
                <Link
                  to="/browsing?category=train"
                  className={`transition-colors ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Trains
                </Link>
              </li>
              <li>
                <Link
                  to="/browsing?category=flight"
                  className={`transition-colors ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Flights
                </Link>
              </li>
              <li>
                <Link
                  to="/browsing?category=events"
                  className={`transition-colors ${
                    isDarkMode ? "hover:text-white" : "hover:text-zinc-950"
                  }`}
                >
                  Concerts & Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3
              className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Contact
            </h3>
            <div
              className={`space-y-3 text-xs sm:text-sm ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Kerala, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>+91 8075631628</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>support@flexibook.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`border-t mt-10 sm:mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDarkMode
              ? "border-zinc-800 text-zinc-500"
              : "border-zinc-200 text-zinc-500"
          }`}
        >
          <p>© {new Date().getFullYear()} FlexiBook. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/help"
              className={`transition-colors ${
                isDarkMode ? "hover:text-zinc-300" : "hover:text-zinc-800"
              }`}
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/help"
              className={`transition-colors ${
                isDarkMode ? "hover:text-zinc-300" : "hover:text-zinc-800"
              }`}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;