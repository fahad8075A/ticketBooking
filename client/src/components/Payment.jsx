import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCreditCard,
  FaShieldAlt,
  FaArrowRight,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import { Sparkles, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Local image imports
import concert from "../assets/concert.jpg";
import tech from "../assets/tech.jpg";
import food from "../assets/food.jpg";
import football from "../assets/football.jpg";
import singer from "../assets/singer.jpg";
import swim from "../assets/swim.jpg";
import art from "../assets/art.jpg";
import plane from "../assets/plane.jpg";
import indigo from "../assets/indigo.jpg";
import emirates from "../assets/emirates.jpg";
import bus1 from "../assets/bus1.jpg";
import bus2 from "../assets/bus2.jpg";
import train1 from "../assets/train1.jpg";
import train2 from "../assets/train2.jpg";
import train3 from "../assets/train3.jpg";
import bus3 from "../assets/bus3.jpg";
import tennis from "../assets/tennis.jpg";
import movie1 from "../assets/movie1.jpg";
import movie2 from "../assets/movie2.jpg";

const localImageMap = {
  concert, tech, food, football, singer, swim, art,
  plane, indigo, emirates, bus1, bus2, train1, train2,
  train3, bus3, tennis, movie1, movie2,
};

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80";

const resolveImage = (rawImg) => {
  if (!rawImg) return DEFAULT_FALLBACK_IMAGE;
  if (localImageMap[rawImg]) return localImageMap[rawImg];

  if (typeof rawImg === "string") {
    const cleanKey = rawImg.replace(/\.[^/.]+$/, "").trim();
    if (localImageMap[cleanKey]) return localImageMap[cleanKey];

    if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
      return rawImg;
    }

    if (rawImg.includes("uploads") || rawImg.startsWith("/")) {
      const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const cleanPath = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
      return `${rawBase}${cleanPath}`;
    }
  }

  return DEFAULT_FALLBACK_IMAGE;
};

// Initialize Stripe outside component render
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51UFpUpKLlp9IUc8lsy8KQKZYW5SvM08Fp4vzf07YqCwjgB6uTz4eLjdabkXJLjCD0bER8ZqQhl4BuMQZC22leGUV00SWd339Ku"
);

// Inner Stripe Card Form
const StripeCardSection = ({ total, onSuccessfulPayment, onError, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    onError("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Card verification failed.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await onSuccessfulPayment(paymentIntent.id);
      } else {
        onError(`Payment incomplete. Status: ${paymentIntent?.status || "Unknown"}`);
      }
    } catch (err) {
      onError(err.message || "An unexpected error occurred during card processing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCardSubmit} className="space-y-4">
      <div className="p-4 rounded-xl bg-[#0b0e17] border border-zinc-800">
        <PaymentElement
          options={{
            layout: "tabs",
            theme: "night",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || submitting || disabled}
        className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing via Stripe...</span>
          </>
        ) : (
          <>
            <FaLock className="text-xs" />
            <span>Pay ₹{total.toLocaleString("en-IN")} with Card</span>
            <FaArrowRight className="text-xs" />
          </>
        )}
      </button>
    </form>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const event = location.state?.event || location.state?.item || {};

  const quantity = Number(
    location.state?.quantity ||
    location.state?.numberOfSeats ||
    location.state?.selectedSeats?.length ||
    1
  );

  const rawTotal = Number(
    location.state?.total ??
    location.state?.totalPrice ??
    (location.state?.ticketPrice ? location.state.ticketPrice * quantity : null) ??
    (location.state?.price ? location.state.price * quantity : null) ??
    (event?.price ? Number(event.price) * quantity : null) ??
    (event?.ticketPrice ? Number(event.ticketPrice) * quantity : null) ??
    0
  );

  const ticketPrice = Number(
    location.state?.ticketPrice ||
    location.state?.price ||
    event?.price ||
    (quantity > 0 ? Math.round(rawTotal / quantity) : rawTotal) ||
    0
  );

  const serviceFee = Number(location.state?.serviceFee || 0);
  const tax = Number(location.state?.tax || 0);
  const total = rawTotal + (serviceFee + tax > 0 ? serviceFee + tax : 0);

  let savedUser = {};
  try {
    savedUser = JSON.parse(
      localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      "{}"
    );
  } catch {
    savedUser = {};
  }

  const [customerName, setCustomerName] = useState(
    location.state?.customerName || savedUser.name || savedUser.fullName || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    location.state?.customerEmail || savedUser.email || ""
  );

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");

  const [clientSecret, setClientSecret] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);
  const [fetchingSecret, setFetchingSecret] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const baseUrl = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  // Step 1: Ensure a database booking record exists
  const persistBooking = async (status = "pending", paymentId = null) => {
    const eventId = event?._id || event?.id || location.state?.eventId;
    if (!eventId) {
      throw new Error("Event or vehicle ID is missing. Please reselect your booking.");
    }

    const cleanSeats = Array.isArray(location.state?.selectedSeats)
      ? location.state.selectedSeats.map((s) => String(s).trim().toUpperCase())
      : [];

    const payload = {
      userId: savedUser._id || savedUser.id || null,
      customerName: customerName.trim() || "Passenger",
      customerEmail: customerEmail.trim() || "passenger@flexibook.com",
      eventId,
      numberOfSeats: quantity,
      selectedSeats: cleanSeats,
      totalPrice: total,
      status,
      paymentMethod,
      paymentId: paymentId || (paymentMethod === "upi" ? `UPI-${Date.now()}` : null),
    };

    const response = await fetch(`${baseUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to persist booking record.");
    }

    const record = data?.booking || data?.data || data;
    setCreatedBooking(record);
    return record;
  };

  // Step 2: Fetch PaymentIntent clientSecret matching your backend service contract
  useEffect(() => {
    if (paymentMethod === "card" && !clientSecret && total > 0) {
      const fetchSecret = async () => {
        setFetchingSecret(true);
        setError("");
        try {
          const bookingRecord = createdBooking?._id ? createdBooking : await persistBooking("pending");
          const targetBookingId = bookingRecord?._id || bookingRecord?.id;

          const res = await fetch(`${baseUrl}/payments/create-intent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              bookingId: targetBookingId,
              amount: total,
              currency: "inr",
            }),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.message || "Failed to initialize payment gateway.");
          }

          setClientSecret(json.data.clientSecret);
        } catch (err) {
          console.error("Stripe initialization error:", err);
          setError(err.message || "Failed to contact payment gateway.");
        } finally {
          setFetchingSecret(false);
        }
      };

      fetchSecret();
    }
  }, [paymentMethod, clientSecret, total]);

  // Step 3: Verify Stripe payment on backend before finalizing client view
  const handleStripeSuccess = async (paymentIntentId) => {
    setLoading(true);
    setError("");

    try {
      const verifyRes = await fetch(`${baseUrl}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || "Failed to verify transaction with backend.");
      }

      navigate("/booking", {
        replace: true,
        state: { booking: createdBooking },
      });
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setError(err.message || "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Handle UPI submission
  const handleUpiPayment = async () => {
    setError("");

    if (!customerName.trim()) {
      setError("Please enter passenger full name.");
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      setError("Please enter a valid notification email.");
      return;
    }

    if (!upiId.trim() || !upiId.includes("@")) {
      setError("Please enter a valid UPI address (e.g. name@okhdfcbank).");
      return;
    }

    setLoading(true);
    try {
      const finalBooking = await persistBooking("confirmed");
      navigate("/booking", {
        replace: true,
        state: { booking: finalBooking },
      });
    } catch (err) {
      setError(err.message || "An error occurred while confirming your UPI booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-zinc-100 font-sans py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Encrypted Payment Gateway</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Checkout & Confirmation
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Review passenger information and confirm ticket purchase.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-8 items-start">
          
          {/* Left Form */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#0f1420] border border-zinc-800/90 shadow-2xl">
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-4">
              1. Passenger Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Passenger Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. John Doe"
                  className="w-full h-11 px-3.5 bg-[#0b0e17] border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-sky-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Notification Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. passenger@flexibook.com"
                  className="w-full h-11 px-3.5 bg-[#0b0e17] border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>

            <hr className="border-zinc-800 mb-6" />

            {/* Method Switcher */}
            <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-4">
              2. Select Payment Method
            </h2>

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("upi");
                  setError("");
                }}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === "upi"
                    ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20"
                    : "bg-[#0b0e17] border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <span>Instant UPI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("card");
                  setError("");
                }}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20"
                    : "bg-[#0b0e17] border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <FaCreditCard className="text-xs" />
                <span>Stripe Card Checkout</span>
              </button>
            </div>

            {/* UPI Option */}
            {paymentMethod === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    UPI Virtual Address
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g. username@okhdfcbank"
                    className="w-full h-11 px-3.5 bg-[#0b0e17] border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-sky-500 transition"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1.5">
                    Supports Google Pay, PhonePe, Paytm, and all bank UPI handles.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-1/3 h-12 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-[#0b0e17] text-zinc-300 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleUpiPayment}
                    className="w-full sm:w-2/3 h-12 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaLock className="text-xs" />
                    <span>{loading ? "Confirming Booking..." : `Pay ₹${total.toLocaleString("en-IN")}`}</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}

            {/* Stripe Card Option */}
            {paymentMethod === "card" && (
              <div>
                {fetchingSecret ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                    <span className="text-xs">Preparing secure Stripe checkout...</span>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "#38bdf8",
                          colorBackground: "#0b0e17",
                          colorText: "#ffffff",
                          colorDanger: "#f43f5e",
                        },
                      },
                    }}
                  >
                    <StripeCardSection
                      total={total}
                      onSuccessfulPayment={handleStripeSuccess}
                      onError={(msg) => setError(msg)}
                      disabled={loading || !customerName.trim() || !customerEmail.trim()}
                    />
                  </Elements>
                ) : (
                  <div className="text-xs text-rose-400 bg-rose-950/30 p-3.5 rounded-xl border border-rose-900/50">
                    Unable to load Stripe. Verify your backend server is online at {baseUrl}.
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-4 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-start gap-3 text-xs">
              <FaShieldAlt className="text-sky-400 text-base shrink-0 mt-0.5" />
              <p className="text-zinc-400 leading-relaxed">
                Transactions processed securely via Stripe. Your card credentials are encrypted and never stored on our servers.
              </p>
            </div>
          </div>

          {/* Right Summary */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#0f1420] border border-zinc-800/90 shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Order Summary
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-[10px] font-bold uppercase">
                {event?.category || "TICKET"}
              </span>
            </div>

            {(event?.title || event?.name) && (
              <div className="flex gap-3.5 items-center mb-6 pb-5 border-b border-zinc-800">
                <img
                  src={resolveImage(event?.image || event?.imageUrl)}
                  alt={event.title || event.name}
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-900"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_FALLBACK_IMAGE;
                  }}
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">
                    {event.title || event.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{event.date || "Upcoming"} • {quantity} Seat(s)</span>
                  </p>
                  {location.state?.selectedSeats?.length > 0 && (
                    <p className="text-xs text-sky-300 font-semibold mt-1 truncate">
                      Seats: {location.state.selectedSeats.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs text-zinc-400 mb-6 pb-5 border-b border-zinc-800">
              <div className="flex justify-between">
                <span>Base Fare ({quantity}x)</span>
                <span className="text-zinc-200">₹{(ticketPrice * quantity).toLocaleString("en-IN")}</span>
              </div>

              {serviceFee > 0 && (
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span className="text-zinc-200">₹{serviceFee.toLocaleString("en-IN")}</span>
                </div>
              )}

              {tax > 0 && (
                <div className="flex justify-between">
                  <span>Transit & Booking Tax</span>
                  <span className="text-zinc-200">₹{tax.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Total Payable
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{total.toLocaleString("en-IN")}
                </h2>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <FaCheckCircle className="text-xs" />
                <span>Guaranteed</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;