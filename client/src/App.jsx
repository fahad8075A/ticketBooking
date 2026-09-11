import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import EventDetails from "./components/EventDetails";
import MyBooking from "./pages/MyBooking";
import Payment from "./components/Payment";
import BookingConfirmation from "./components/BookingConfirmation";
import Help from "./pages/Help";
import MyBookingPage from "./components/MyBookingPage";
import LoginPage from "./components/LoginPage";
import VerifyOtpPage from "./components/VerifyOtpPage";
import ProfilePage from "./components/ProfilePage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="browsing" element={<Browse />} />
        {/* Removed leading slash so it nests properly */}
        <Route path="event/:id" element={<EventDetails />} />
        <Route path="bookings" element={<MyBooking />} />
        <Route path="payment" element={<Payment />} />
        <Route path="confi" element={<BookingConfirmation />} />
        <Route path="help" element={<Help />} />
        <Route path="booking" element={<MyBookingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;