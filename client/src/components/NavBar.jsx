import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaTicketAlt, FaSignOutAlt } from "react-icons/fa";
import { Sparkles, Menu, X } from "lucide-react";
import profile from "../assets/profile.jpg";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Robust auth status resolver
  const getAuthStatus = useCallback(() => {
    const rawToken =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    const hasValidToken =
      Boolean(rawToken) &&
      rawToken !== "undefined" &&
      rawToken !== "null" &&
      rawToken.trim() !== "";

    const isExplicitAuth =
      sessionStorage.getItem("isAuthenticated") === "true" ||
      localStorage.getItem("isAuthenticated") === "true";

    const isGuest =
      sessionStorage.getItem("userRole") === "guest" ||
      localStorage.getItem("userRole") === "guest";

    let storedEmail =
      sessionStorage.getItem("userEmail") ||
      localStorage.getItem("userEmail");

    if (!storedEmail) {
      try {
        const rawUser =
          localStorage.getItem("user") ||
          localStorage.getItem("currentUser") ||
          sessionStorage.getItem("user");
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          storedEmail = parsed.email || parsed.name || parsed.fullName;
        }
      } catch {
        storedEmail = null;
      }
    }

    return {
      isLoggedIn: hasValidToken || isExplicitAuth || isGuest,
      userEmail: storedEmail || (isGuest ? "Guest User" : "Account"),
    };
  }, []);

  const [authState, setAuthState] = useState(getAuthStatus);

  // Sync auth across routing changes and multi-tab storage triggers
  useEffect(() => {
    const syncAuth = () => {
      setAuthState(getAuthStatus());
    };

    syncAuth();

    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [location, getAuthStatus]);

  const { isLoggedIn, userEmail } = authState;

  const closeMenu = () => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Complete cleanup on logout to prevent account cross-contamination
  const handleLogout = () => {
    sessionStorage.clear();

    const authKeys = [
      "token",
      "authToken",
      "user",
      "currentUser",
      "isAuthenticated",
      "userEmail",
      "userRole",
      "role",
    ];
    authKeys.forEach((key) => localStorage.removeItem(key));

    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("storage"));

    setAuthState({ isLoggedIn: false, userEmail: "Account" });
    closeMenu();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#07090e]/95 backdrop-blur-md border-b border-white/[0.04] font-sans transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Brand Logo */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-sky-300 transition-colors">
            Flexi<span className="text-[#38bdf8]">Book</span>
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-10 text-xs font-bold tracking-widest uppercase">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-all duration-200 pb-1 ${
                  isActive
                    ? "text-[#38bdf8] font-black border-b-2 border-[#38bdf8] shadow-[0_1px_10px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `transition-all duration-200 pb-1 ${
                  isActive
                    ? "text-[#38bdf8] font-black border-b-2 border-[#38bdf8] shadow-[0_1px_10px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              Browse
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `transition-all duration-200 pb-1 ${
                  isActive
                    ? "text-[#38bdf8] font-black border-b-2 border-[#38bdf8] shadow-[0_1px_10px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              My Booking
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `transition-all duration-200 pb-1 ${
                  isActive
                    ? "text-[#38bdf8] font-black border-b-2 border-[#38bdf8] shadow-[0_1px_10px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              Help
            </NavLink>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            /* Logged-in view: Avatar with Dropdown */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="inline-block rounded-full p-0.5 border border-sky-400/40 hover:border-sky-400 transition-transform hover:scale-105 cursor-pointer focus:outline-none"
                aria-label="Open profile options"
              >
                <img
                  src={profile}
                  alt="Profile"
                  className={`w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full object-cover ${
                    isProfileMenuOpen ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-[#07090e]" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0f1420]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 py-2.5 z-50 text-slate-200">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Account</p>
                    <p className="text-xs font-semibold text-white truncate mt-0.5">{userEmail}</p>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <FaUser className="text-sky-400 text-xs" /> My Profile
                  </NavLink>

                  <NavLink
                    to="/booking"
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <FaTicketAlt className="text-sky-400 text-xs" /> My Booking
                  </NavLink>

                  <div className="border-t border-white/5 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer text-left"
                    >
                      <FaSignOutAlt className="text-rose-400 text-xs" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out view */
            <div className="flex items-center gap-2 sm:gap-3">
              <NavLink
                to="/login"
                className="hidden sm:inline-block text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/login"
                className="hidden sm:inline-block bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md shadow-sky-500/25 active:scale-95"
              >
                Register
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl md:hidden text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pt-3 pb-6 border-t border-white/5 bg-[#07090e]/95 backdrop-blur-2xl text-slate-200 shadow-2xl">
          <ul className="flex flex-col gap-3.5 font-medium text-xs">
            <li>
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-1.5 ${isActive ? "text-sky-400 font-bold" : "text-slate-400 hover:text-white"}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/browse"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-1.5 ${isActive ? "text-sky-400 font-bold" : "text-slate-400 hover:text-white"}`
                }
              >
                Browse
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/booking"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-1.5 ${isActive ? "text-sky-400 font-bold" : "text-slate-400 hover:text-white"}`
                }
              >
                My Booking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/help"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-1.5 ${isActive ? "text-sky-400 font-bold" : "text-slate-400 hover:text-white"}`
                }
              >
                Help
              </NavLink>
            </li>
          </ul>

          <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-2.5">
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-[#0f1420] text-white border border-white/10 transition"
                >
                  My Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-[#0f1420] text-white border border-white/10 transition"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center bg-sky-500 hover:bg-sky-400 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-sky-500/25"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;