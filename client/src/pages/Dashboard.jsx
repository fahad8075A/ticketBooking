import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Users,
  BadgeDollarSign,
  BarChart3,
  Settings,
  Search,
  Moon,
  Bell,
  Globe,
  SlidersHorizontal,
  Maximize2,
  Ticket,
  TrendingDown,
  SunMedium,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [activeInternalTab, setActiveInternalTab] = useState('Dashboard');
  const [stats, setStats] = useState({
    totalReqTickets: 0,
    totalSoldTickets: 0,
    totalProfits: 0,
    totalCancelled: 0,
    bookedRate: 0,
    cancelledRate: 0,
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/bookings');
        const json = await res.json();

        const bookingList = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        setBookings(bookingList);

        if (bookingList.length > 0) {
          const sold = bookingList.filter((b) => b.status !== 'cancelled').length;
          const cancelled = bookingList.filter((b) => b.status === 'cancelled').length;
          const revenue = bookingList
            .filter((b) => b.status !== 'cancelled')
            .reduce((acc, curr) => acc + (curr.totalPrice || curr.amount || 0), 0);

          setStats({
            totalReqTickets: bookingList.length,
            totalSoldTickets: sold,
            totalProfits: revenue,
            totalCancelled: cancelled,
            bookedRate: Math.round((sold / bookingList.length) * 100),
            cancelledRate: Math.round((cancelled / bookingList.length) * 100),
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  // Menu mapping connected to your App.jsx routes
  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, isRoute: true },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck, isRoute: true },
    { label: 'Events', path: '/browsing', icon: Calendar, isRoute: true },
    { label: 'Customers', id: 'Customers', icon: Users, isRoute: false },
    { label: 'Revenue', id: 'Revenue', icon: BadgeDollarSign, isRoute: false },
    { label: 'Analytics', id: 'Analytics', icon: BarChart3, isRoute: false },
    { label: 'Settings', path: '/profile', icon: Settings, isRoute: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#eaf1f8] font-sans antialiased text-slate-700">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-5 select-none shrink-0">
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 px-2 mb-8 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Ticket className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Tresto Admin</span>
        </div>

        {/* Navigation */}
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          DASHBOARD
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            if (item.isRoute) {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    if (item.path === '/dashboard') setActiveInternalTab('Dashboard');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    isActive && activeInternalTab === 'Dashboard'
                      ? 'bg-blue-100/70 text-blue-600'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            }

            // Fallback for tabs without dedicated App.js routes yet
            const isTabActive = activeInternalTab === item.id;
            return (
              <button
                key={item.label}
                onClick={() => setActiveInternalTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  isTabActive
                    ? 'bg-blue-100/70 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#f1f5f9] text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition">
              <Moon className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition relative">
              <Bell className="w-4 h-4" />
              {bookings.length > 0 && (
                <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5" />
              )}
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition">
              <Globe className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <div 
              onClick={() => navigate('/profile')} 
              className="w-8 h-8 rounded-full bg-slate-300 ml-2 overflow-hidden border border-slate-200 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 space-y-6 overflow-y-auto">
          {activeInternalTab === 'Dashboard' ? (
            <>
              {/* Row 1: Sales Stats, Sales Overview, Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Ticket Sales Stats */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-slate-800 text-sm mb-6">Ticket Sales Stats</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100/70 flex items-center justify-center text-rose-500">
                        <Ticket className="w-5 h-5 rotate-45" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Total Req. Tickets</p>
                        <p className="text-xl font-bold text-rose-500">{stats.totalReqTickets}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Total Sold Tickets</p>
                        <p className="text-xl font-bold text-emerald-500">{stats.totalSoldTickets}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100/70 flex items-center justify-center text-blue-500">
                        <BadgeDollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Total Profits</p>
                        <p className="text-xl font-bold text-blue-500">${stats.totalProfits}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-100/70 flex items-center justify-center text-cyan-500">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Total Cancelled</p>
                        <p className="text-xl font-bold text-cyan-500">{stats.totalCancelled}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Overview */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-4">Sales Overview</h3>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs text-slate-400">Current year</p>
                        <p className="text-lg font-bold text-slate-800">${stats.totalProfits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Last year</p>
                        <p className="text-lg font-bold text-slate-400">$0</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-28 flex items-center justify-center text-xs text-slate-300 border-b border-dashed border-slate-200 mt-4">
                    No historical chart data
                  </div>
                </div>

                {/* Donut Analytics */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm w-full text-left">Analytics</h3>
                  <div className="relative w-28 h-28 my-2 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-500 transition-all duration-700 ease-out"
                        strokeDasharray={`${stats.bookedRate}, 100`}
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-semibold text-slate-600">{stats.bookedRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between w-full text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <span>Booked: <strong className="text-slate-800">{stats.bookedRate}%</strong></span>
                    <span>Cancelled: <strong className="text-slate-800">{stats.cancelledRate}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Row 2: Booking Overview & Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-slate-800 text-sm mb-4">Booking Overview</h3>
                  <div className="flex gap-8 mb-4">
                    <div>
                      <p className="text-xs text-slate-400">Current year</p>
                      <p className="text-lg font-bold text-slate-800">${stats.totalProfits}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last year</p>
                      <p className="text-lg font-bold text-slate-400">$0</p>
                    </div>
                  </div>
                  <div className="h-44 rounded-xl bg-slate-50/60 border border-slate-100 flex items-center justify-center text-xs text-slate-400">
                    Awaiting new bookings to populate monthly trends
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-amber-500">
                      <SunMedium className="w-8 h-8" />
                      <span className="text-3xl font-bold text-slate-800">27°C</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-slate-400">Live Status</p>
                      <p className="text-sm font-semibold text-slate-700">Online & Listening</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Earnings</p>
                      <p className="text-2xl font-bold text-slate-800 mt-2">${stats.totalProfits.toFixed(2)}</p>
                    </div>
                    <div className="flex items-end gap-1 h-12 mt-4 pt-2">
                      {[20, 40, 60, 30, 70, 50, 85].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: stats.totalProfits > 0 ? `${h}%` : '6px' }}
                          className={`flex-1 rounded-t transition-all ${
                            stats.totalProfits > 0 ? 'bg-blue-400' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Recent Bookings */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm mb-4">Recent Bookings</h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center gap-2">
                    <Clock className="w-8 h-8 text-slate-300" />
                    No bookings recorded yet. Once a booking is created, it will automatically appear here.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="border-b border-slate-100 text-slate-400 uppercase text-xs">
                        <tr>
                          <th className="py-3 px-4">Booking ID</th>
                          <th className="py-3 px-4">Event Name</th>
                          <th className="py-3 px-4">Tickets</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b, idx) => (
                          <tr key={b._id || idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-medium text-slate-700">#{b._id ? b._id.slice(-6) : `BK-00${idx + 1}`}</td>
                            <td className="py-3 px-4">{b.eventName || b.event || 'Standard Ticket'}</td>
                            <td className="py-3 px-4">{b.ticketsCount || b.quantity || 1}</td>
                            <td className="py-3 px-4 font-semibold text-slate-800">${b.totalPrice || b.amount || 0}</td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                {b.status || 'Confirmed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Sub-tab view for items that don't have separate route pages */
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">{activeInternalTab}</h2>
                <button
                  onClick={() => setActiveInternalTab('Dashboard')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Back to Dashboard
                </button>
              </div>
              <p className="text-slate-400 text-sm">
                This is the placeholder section for <strong>{activeInternalTab}</strong>. You can connect custom components or metrics here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}