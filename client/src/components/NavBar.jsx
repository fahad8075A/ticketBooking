import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaTicketAlt, FaSignOutAlt } from "react-icons/fa";
import profile from "../assets/profile.jpg";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  // Check auth helper
  const getAuthStatus = useCallback(() => {
    const isAuth =
      sessionStorage.getItem("isAuthenticated") === "true" ||
      localStorage.getItem("isAuthenticated") === "true";

    const isGuest =
      sessionStorage.getItem("userRole") === "guest" ||
      localStorage.getItem("userRole") === "guest";

    const storedEmail =
      sessionStorage.getItem("userEmail") ||
      localStorage.getItem("userEmail") ||
      (isGuest ? "Guest User" : "User");

    return {
      isLoggedIn: isAuth || isGuest,
      userEmail: storedEmail,
    };
  }, []);

  const [authState, setAuthState] = useState(getAuthStatus);

  // Sync auth on route change, custom authChange event, and cross-tab storage updates
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

  // Helper to close menus
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

  // Logout handler
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    // Inform all components that authentication has cleared
    window.dispatchEvent(new Event("authChange"));

    setAuthState({ isLoggedIn: false, userEmail: "User" });
    closeMenu();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isHome
          ? "absolute"
          : "sticky bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Brand Logo */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isHome ? "text-white" : "text-[#0F4C81]"
          }`}
        >
          FlexiBook
        </NavLink>

        {/* Desktop Navigation Links */}
        <ul
          className={`hidden md:flex items-center gap-8 lg:gap-10 font-medium ${
            isHome ? "text-white" : "text-gray-700"
          }`}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `border-b-2 ${isHome ? "border-white" : "border-blue-600"} pb-1`
                  : "hover:text-blue-500 transition-colors"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/browsing"
              className={({ isActive }) =>
                isActive
                  ? `border-b-2 ${isHome ? "border-white" : "border-blue-600"} pb-1`
                  : "hover:text-blue-500 transition-colors"
              }
            >
              Browse
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                isActive
                  ? `border-b-2 ${isHome ? "border-white" : "border-blue-600"} pb-1`
                  : "hover:text-blue-500 transition-colors"
              }
            >
              My Booking
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                isActive
                  ? `border-b-2 ${isHome ? "border-white" : "border-blue-600"} pb-1`
                  : "hover:text-blue-500 transition-colors"
              }
            >
              Help
            </NavLink>
          </li>
        </ul>

        {/* Right Section (Auth / Profile Dropdown + Hamburger) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            /* Logged-in view: Avatar with Dropdown */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="inline-block rounded-full transition-transform hover:scale-105 cursor-pointer focus:outline-none"
                aria-label="Open profile options"
              >
                <img
                  src={profile}
                  alt="Profile"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ${
                    isHome ? "border-2 border-white" : "border border-gray-300"
                  } ${isProfileMenuOpen ? "ring-2 ring-amber-500 ring-offset-2" : ""}`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-[#F8FAFC]/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 text-gray-800">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Account</p>
                    <p className="text-xs font-semibold text-gray-800 truncate">{userEmail}</p>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-white/60 transition"
                  >
                    <FaUser className="text-gray-400 text-xs" /> My Profile
                  </NavLink>

                  <NavLink
                    to="/booking"
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-white/60 transition"
                  >
                    <FaTicketAlt className="text-gray-400 text-xs" /> My Booking
                  </NavLink>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                    >
                      <FaSignOutAlt className="text-red-500 text-xs" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out view: Sign In & Register */
            <>
              <NavLink
                to="/login"
                className={`hidden sm:inline-block font-medium ${
                  isHome
                    ? "text-white hover:text-blue-300"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Sign in
              </NavLink>

              <NavLink
                to="/login"
                className="hidden sm:inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-sm sm:text-base font-medium transition-colors"
              >
                Register
              </NavLink>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className={`p-2 rounded-lg md:hidden focus:outline-none ${
              isHome ? "text-white" : "text-gray-700"
            }`}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer/Dropdown Menu */}
      {isOpen && (
        <div
          className={`md:hidden px-6 pt-3 pb-6 border-t ${
            isHome
              ? "bg-black/90 backdrop-blur-md text-white border-white/20"
              : "bg-[#F8FAFC]/95 backdrop-blur-md text-gray-800 border-gray-200 shadow-xl"
          }`}
        >
          <ul className="flex flex-col gap-4 font-medium">
            <li>
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-1 ${isActive ? "text-blue-500 font-semibold" : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/browsing"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block py-1 ${isActive ? "text-blue-500 font-semibold" : ""}`
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
                  `block py-1 ${isActive ? "text-blue-500 font-semibold" : ""}`
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
                  `block py-1 ${isActive ? "text-blue-500 font-semibold" : ""}`
                }
              >
                Help
              </NavLink>
            </li>
          </ul>

          {/* Mobile Auth Actions */}
          <div className="mt-5 pt-4 border-t border-gray-200/20 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className="w-full text-center py-2 rounded-xl font-medium border border-current"
                >
                  My Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2 rounded-xl font-medium border border-current"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium"
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