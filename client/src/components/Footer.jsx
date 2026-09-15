import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Sparkles, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#050913] text-white border-t border-slate-800/80 overflow-hidden font-sans">
      {/* Background Lighting Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] font-extrabold uppercase tracking-[0.25em]">
              <Sparkles className="w-3 h-3 text-sky-400" />
              
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              FlexiBook
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Book tickets for movies, buses, trains, flights, sports, and live events with seamless ease.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browsing" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  Explore <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-sky-400 transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-sky-400 transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/browsing?category=movie" className="hover:text-sky-400 transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/browsing?category=bus" className="hover:text-sky-400 transition-colors">
                  Buses
                </Link>
              </li>
              <li>
                <Link to="/browsing?category=train" className="hover:text-sky-400 transition-colors">
                  Trains
                </Link>
              </li>
              <li>
                <Link to="/browsing?category=flight" className="hover:text-sky-400 transition-colors">
                  Flights
                </Link>
              </li>
              <li>
                <Link to="/browsing?category=events" className="hover:text-sky-400 transition-colors">
                  Concerts & Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Kerala, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+91 8075631628</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>support@flexibook.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 sm:mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 FlexiBook • AirTrek. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <Link to="/help" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/help" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;