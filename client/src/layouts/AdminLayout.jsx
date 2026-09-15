import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuCalendarDays,
  LuTags,
  LuTicket,
  LuCreditCard,
  LuMenu,
  LuX,
  LuLogOut,
  LuBell,
  LuChevronRight,
  LuExternalLink,
  LuShieldCheck,
} from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const NAV_ITEMS = [
  { name: "Overview", path: "/admin", icon: LuLayoutDashboard, exact: true },
  { name: "Users", path: "/admin/users", icon: LuUsers },
  { name: "Events", path: "/admin/events", icon: LuCalendarDays },
  { name: "Categories", path: "/admin/categories", icon: LuTags },
  { name: "Bookings", path: "/admin/bookings", icon: LuTicket },
  { name: "Payments", path: "/admin/payments", icon: LuCreditCard },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickStats, setQuickStats] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Read stored auth data across multiple key variants
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken");

  let parsedUser = {};
  try {
    parsedUser = JSON.parse(
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser") ||
      "{}"
    );
  } catch {
    parsedUser = {};
  }

  const userRole =
    localStorage.getItem("userRole") ||
    localStorage.getItem("role") ||
    parsedUser.role ||
    "user";

  const userEmail =
    localStorage.getItem("userEmail") ||
    parsedUser.email ||
    "admin@flexibook.com";

  useEffect(() => {
    // Check if token exists and either role is admin or isAdmin flag is true
    const hasAdminAccess = Boolean(
      token && (userRole === "admin" || parsedUser.isAdmin === true)
    );

    if (!hasAdminAccess) {
      setIsAuthorized(false);
      setIsLoadingAuth(false);
      return;
    }

    setIsAuthorized(true);
    setIsLoadingAuth(false);

    const fetchLiveStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-email": userEmail,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setQuickStats(data.data.counts);
          }
        }
      } catch (err) {
        console.error("Failed to load header stats:", err);
      }
    };

    fetchLiveStats();
  }, [token, userRole, userEmail, parsedUser.isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    window.dispatchEvent(new Event("authChange"));
    navigate("/admin/login", { replace: true });
  };

  const getPageTitle = () => {
    const currentItem = NAV_ITEMS.find((item) =>
      item.exact
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path) && item.path !== "/admin"
    );
    return currentItem ? currentItem.name : "Dashboard";
  };

  // 1. Loading screen
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthorized screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-xl shadow-slate-200/50 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4 ring-8 ring-rose-50/50">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 mb-6">
            You do not have administrative privileges to access this area.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition duration-150 active:scale-95 cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-sm shadow-sky-200 transition duration-150 active:scale-95 cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Layout Shell
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-700 flex font-sans antialiased">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-out shadow-sm lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center font-bold text-white text-base shadow-sm shadow-sky-200">
              F
            </span>
            <div className="leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-800 block">
                FlexiBook
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 flex items-center gap-1 mt-0.5">
                <LuShieldCheck className="w-3 h-3 text-sky-500" /> Admin Portal
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            let badgeValue = null;

            if (quickStats) {
              if (item.name === "Users") badgeValue = quickStats.users;
              if (item.name === "Events") badgeValue = quickStats.events;
              if (item.name === "Bookings") badgeValue = quickStats.bookings;
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sky-50 text-sky-600 border border-sky-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] font-semibold"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-sky-600" : "text-slate-400 group-hover:text-sky-600"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {badgeValue !== null && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                          isActive
                            ? "bg-sky-100/70 text-sky-700"
                            : "bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600"
                        }`}
                      >
                        {badgeValue}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/40">
          <button
            onClick={() => navigate("/")}
            className="group w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LuExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
              Live Website
            </span>
            <LuChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50/70 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <LuLogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95"
            >
              <LuMenu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition duration-150 active:scale-95">
              <LuBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white animate-pulse" />
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center font-bold text-white text-xs shadow-sm uppercase">
                {userEmail.charAt(0)}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                  {userEmail}
                </span>
                <span className="text-[10px] text-sky-600 font-semibold uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;