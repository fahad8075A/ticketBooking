import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
              FlexiBook
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-gray-500 leading-relaxed">
              Book tickets for movies, buses, trains, flights, sports and events with ease.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
              <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
              <li><Link to="/browse" className="hover:text-blue-600 transition">Movies</Link></li>
              <li><Link to="/browse" className="hover:text-blue-600 transition">Buses</Link></li>
              <li><Link to="/browse" className="hover:text-blue-600 transition">Trains</Link></li>
              <li><Link to="/browse" className="hover:text-blue-600 transition">Flights</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Contact
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm text-gray-500">
              <p>📍 Kerala, India</p>
              <p>📞 +91 8075631628</p>
              <p>✉ support@flexibook.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 sm:mt-12 pt-6 text-center text-xs text-gray-400">
          © 2026 FlexiBook. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;