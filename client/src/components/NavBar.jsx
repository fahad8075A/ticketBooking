import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Ticket,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import profile from "../assets/profile.jpg";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const { isDarkMode, toggleTheme } = useTheme();
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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  const navLinkClass = ({ isActive }) =>
    `transition-colors font-medium text-xs tracking-wider uppercase py-1 ${
      isActive
        ? isDarkMode
          ? "text-white font-semibold border-b-2 border-white"
          : "text-zinc-950 font-semibold border-b-2 border-zinc-950"
        : isDarkMode
        ? "text-zinc-400 hover:text-zinc-200"
        : "text-zinc-600 hover:text-zinc-900"
    }`;

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-300 font-sans select-none ${
        isDarkMode
          ? "bg-zinc-950/90 border-zinc-800 text-zinc-100"
          : "bg-white/90 border-zinc-200 text-zinc-900"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand Logo */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-1 cursor-pointer"
        >
          <span
            className={`text-xl sm:text-2xl font-semibold tracking-tight transition-colors ${
              isDarkMode ? "text-white" : "text-zinc-950"
            }`}
          >
            FlexiBook
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10">
          <li>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/browse" className={navLinkClass}>
              Browse
            </NavLink>
          </li>
          <li>
            <NavLink to="/booking" className={navLinkClass}>
              My Booking
            </NavLink>
          </li>
          <li>
            <NavLink to="/help" className={navLinkClass}>
              Help
            </NavLink>
          </li>
        </ul>

        {/* Right Section: Theme Toggle + Auth Status */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 shadow-xs"
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            /* Logged-in profile icon & menu */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className={`inline-block rounded-full p-0.5 border transition-all cursor-pointer focus:outline-none ${
                  isDarkMode
                    ? "border-zinc-700 hover:border-zinc-500"
                    : "border-zinc-300 hover:border-zinc-400"
                }`}
                aria-label="Open profile options"
              >
                <img
                  src={profile}
                  alt="Profile"
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ${
                    isProfileMenuOpen
                      ? isDarkMode
                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950"
                        : "ring-2 ring-zinc-950 ring-offset-2 ring-offset-white"
                      : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div
                  className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-xl border py-2 z-50 transition-colors ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                      : "bg-white border-zinc-200 text-zinc-800"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 border-b ${
                      isDarkMode ? "border-zinc-800" : "border-zinc-100"
                    }`}
                  >
                    <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                      Signed In As
                    </p>
                    <p className="text-xs font-medium truncate mt-0.5">
                      {userEmail}
                    </p>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition ${
                      isDarkMode
                        ? "text-zinc-300 hover:text-white hover:bg-zinc-800/70"
                        : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </NavLink>

                  <NavLink
                    to="/booking"
                    onClick={closeMenu}
                    className={`flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition ${
                      isDarkMode
                        ? "text-zinc-300 hover:text-white hover:bg-zinc-800/70"
                        : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>My Bookings</span>
                  </NavLink>

                  <div
                    className={`border-t mt-1.5 pt-1.5 ${
                      isDarkMode ? "border-zinc-800" : "border-zinc-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-500 transition cursor-pointer text-left ${
                        isDarkMode ? "hover:bg-rose-500/10" : "hover:bg-rose-50"
                      }`}
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out buttons */
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className={`hidden sm:inline-block text-xs font-medium px-3.5 py-2 rounded-xl border transition-colors ${
                  isDarkMode
                    ? "text-zinc-300 border-zinc-800 hover:text-white hover:bg-zinc-900"
                    : "text-zinc-700 border-zinc-200 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                Sign In
              </NavLink>

              <NavLink
                to="/login"
                className={`hidden sm:inline-block px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                  isDarkMode
                    ? "bg-white hover:bg-zinc-200 text-zinc-950"
                    : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs"
                }`}
              >
                Register
              </NavLink>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className={`p-2 rounded-xl md:hidden transition cursor-pointer border ${
              isDarkMode
                ? "border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900"
                : "border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          className={`md:hidden px-5 pt-3 pb-6 border-t shadow-xl transition-colors ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800 text-zinc-200"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          <ul className="flex flex-col gap-3 text-xs font-medium">
            <li>
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-1.5 ${
                    isActive
                      ? isDarkMode
                        ? "text-white font-semibold"
                        : "text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`
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
                  `block py-1.5 ${
                    isActive
                      ? isDarkMode
                        ? "text-white font-semibold"
                        : "text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`
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
                  `block py-1.5 ${
                    isActive
                      ? isDarkMode
                        ? "text-white font-semibold"
                        : "text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`
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
                  `block py-1.5 ${
                    isActive
                      ? isDarkMode
                        ? "text-white font-semibold"
                        : "text-zinc-950 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`
                }
              >
                Help
              </NavLink>
            </li>
          </ul>

          <div
            className={`mt-4 pt-4 border-t flex flex-col gap-2 ${
              isDarkMode ? "border-zinc-800" : "border-zinc-200"
            }`}
          >
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={`w-full text-center py-2.5 rounded-xl text-xs font-medium border transition ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
                      : "bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  My Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={`w-full text-center py-2.5 rounded-xl text-xs font-medium border transition ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200"
                      : "bg-zinc-50 border-zinc-200 text-zinc-800"
                  }`}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={`w-full text-center py-2.5 rounded-xl text-xs font-medium transition ${
                    isDarkMode
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
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