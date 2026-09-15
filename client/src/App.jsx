import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages & Components
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import EventDetails from "./components/EventDetails";
import Help from "./pages/Help";
import LoginPage from "./components/LoginPage";
import VerifyOtpPage from "./components/VerifyOtpPage";
import ProfilePage from "./components/ProfilePage";

// Dedicated Booking Components
import TrainDetails from "./components/booking/TrainDetails";
import BusSeatBooking from "./components/booking/BusSeatBooking";
import FlightSeatBooking from "./components/booking/FlightSeatBooking";
import MovieSeatBooking from "./components/booking/MovieSeatBooking";
import SportsSeatBooking from "./components/booking/SportsSeatBooking"; // Added
import GeneralTicketBooking from "./components/booking/GeneralTicketBooking";
import BookingSeatPage from "./pages/BookingSeatPage";

// Account & Checkout Pages
import MyBooking from "./pages/MyBooking";
import MyBookingPage from "./components/MyBookingPage";
import Payment from "./components/Payment";
import BookingConfirmation from "./components/BookingConfirmation";

// Admin Authentication & Pages
import AdminLogin from "./pages/AdminLogin";
import DashboardOverview from "./pages/admin/DashboardOverview";
import UsersManagement from "./pages/admin/UsersManagement";
import BookingsManagement from "./pages/admin/BookingsManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import PaymentsManagement from "./pages/admin/PaymentsManagement";

// Protected User Route Guard
const UserProtectedRoute = () => {
  const location = useLocation();

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

  const isExplicitlyAuthed =
    localStorage.getItem("isAuthenticated") === "true" ||
    sessionStorage.getItem("isAuthenticated") === "true";

  let hasValidUser = false;
  try {
    const rawUser =
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser") ||
      sessionStorage.getItem("user");

    if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
      const parsed = JSON.parse(rawUser);
      hasValidUser = Boolean(parsed && typeof parsed === "object");
    }
  } catch {
    hasValidUser = false;
  }

  const isAuthenticated = hasValidToken || isExplicitlyAuthed || hasValidUser;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectTo: location.pathname,
          redirectState: location.state,
        }}
      />
    );
  }

  return <Outlet />;
};

// Protected Admin Route Guard
const AdminProtectedRoute = () => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken");

  let storedUser = {};
  try {
    storedUser = JSON.parse(
      localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("user") ||
        "{}"
    );
  } catch {
    storedUser = {};
  }

  const role =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    storedUser.role;

  const isAdmin =
    Boolean(token) &&
    !storedUser.isGuest &&
    (role === "admin" || storedUser.isAdmin === true);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <Routes>
      {/* 1. Public & Client Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="browsing" element={<Browse />} />

        {/* Dynamic Event Details */}
        <Route path="event/:id" element={<EventDetails />} />
        <Route path="events/:id" element={<EventDetails />} />

        {/* Dedicated Transport & Entertainment Seat Routes */}
        <Route path="trains/:id" element={<TrainDetails />} />
        <Route path="train/:id" element={<TrainDetails />} />
        <Route path="book/train" element={<TrainDetails />} />
        <Route path="book/bus" element={<BusSeatBooking />} />
        <Route path="book/flight" element={<FlightSeatBooking />} />
        <Route path="book/movie" element={<MovieSeatBooking />} />
        <Route path="book/sports" element={<SportsSeatBooking />} /> {/* Added */}
        <Route path="book/general" element={<GeneralTicketBooking />} />
        <Route path="book/seats" element={<BookingSeatPage />} />
        <Route path="book-seats" element={<BookingSeatPage />} /> {/* Route alias */}

        {/* Info & Auth */}
        <Route path="help" element={<Help />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />

        {/* Protected Checkout & User Pages */}
        <Route element={<UserProtectedRoute />}>
          <Route path="bookings" element={<MyBooking />} />
          <Route path="booking" element={<MyBookingPage />} />
          <Route path="my-bookings" element={<MyBooking />} />
          <Route path="payment" element={<Payment />} />
          <Route path="confirmation" element={<BookingConfirmation />} />
          <Route path="confi" element={<BookingConfirmation />} /> {/* Backward compatibility */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 2. Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 3. Protected Admin Portal */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="bookings" element={<BookingsManagement />} />
          <Route path="events" element={<EventsManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="payments" element={<PaymentsManagement />} />
        </Route>
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;