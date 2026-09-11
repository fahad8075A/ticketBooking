import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const event = location.state?.event;

  const ticketPrice = location.state?.ticketPrice || 0;
  const serviceFee = location.state?.serviceFee || 0;
  const tax = location.state?.tax || 0;
  const total = location.state?.total || 0;
  const quantity = location.state?.quantity || 1;

  // Passenger Details
  const [customerName, setCustomerName] = useState(location.state?.customerName || "");
  const [customerEmail, setCustomerEmail] = useState(location.state?.customerEmail || "");

  const [paymentMethod, setPaymentMethod] = useState("upi");

  // UPI
  const [upiId, setUpiId] = useState("");

  // Card
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Save to MongoDB & Navigate
  const processBooking = async () => {
    setLoading(true);
    setError("");

    try {
      const eventId = event?._id || event?.id || location.state?.eventId;

      if (!eventId) {
        throw new Error("Event ID is missing. Please select an event again.");
      }

      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        eventId: eventId,
        numberOfSeats: Number(quantity) || 1,
        totalPrice: Number(total) || (Number(ticketPrice) * Number(quantity)),
        status: "confirmed"
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to confirm booking.");
      }

      // Successfully saved in DB -> Go straight to Ticket Wallet
      navigate("/booking");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "An error occurred while saving your booking.");
    } finally {
      setLoading(false);
    }
  };

  // Pay button handler
  const handlePayment = async () => {
    setError("");

    // Passenger Validation
    if (!customerName.trim()) {
      setError("Please enter passenger name");
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    // ================= UPI VALIDATION =================
    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        setError("Please enter your UPI ID");
        return;
      }

      if (!upiId.includes("@")) {
        setError("Please enter a valid UPI ID");
        return;
      }

      await processBooking();
      return;
    }

    // ================= CARD VALIDATION =================
    if (paymentMethod === "card") {
      if (!cardName.trim()) {
        setError("Please enter card holder name");
        return;
      }

      if (!cardNumber.trim()) {
        setError("Please enter card number");
        return;
      }

      const cleanCardNumber = cardNumber.replace(/\s/g, "");

      if (cleanCardNumber.length !== 16) {
        setError("Card number must be 16 digits");
        return;
      }

      if (!/^\d+$/.test(cleanCardNumber)) {
        setError("Card number must contain only numbers");
        return;
      }

      if (!expiry.trim()) {
        setError("Please enter expiry date");
        return;
      }

      if (!cvv.trim()) {
        setError("Please enter CVV");
        return;
      }

      if (!/^\d{3}$/.test(cvv)) {
        setError("CVV must be 3 digits");
        return;
      }

      await processBooking();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#164E70] mb-2">
          Payment
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Complete passenger info and choose your payment method
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ================= PAYMENT FORM ================= */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            {/* PASSENGER DETAILS */}
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Passenger Information
            </h2>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-gray-500 font-medium">Passenger Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. John Doe"
                  className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none text-sm focus:border-[#164E70]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Contact Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. johndoe@example.com"
                  className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none text-sm focus:border-[#164E70]"
                />
              </div>
            </div>

            <hr className="mb-6" />

            <h2 className="text-lg font-semibold text-[#164E70] mb-5">
              {paymentMethod === "upi" ? "UPI Payment" : "Credit / Debit Card"}
            </h2>

            {/* PAYMENT METHOD SELECTOR */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("upi");
                  setError("");
                }}
                className={`px-5 py-3 border rounded-md text-sm font-medium transition cursor-pointer ${
                  paymentMethod === "upi"
                    ? "border-[#164E70] bg-[#eef4f8] text-[#164E70]"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                UPI
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("card");
                  setError("");
                }}
                className={`px-5 py-3 border rounded-md text-sm font-medium transition cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-[#164E70] bg-[#eef4f8] text-[#164E70]"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Credit / Debit Card
              </button>
            </div>

            {/* UPI FORM */}
            {paymentMethod === "upi" && (
              <div>
                <label className="text-xs text-gray-500 font-medium">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setError("");
                  }}
                  placeholder="example@okaxis"
                  className="w-full mt-2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none text-sm focus:border-[#164E70]"
                />

                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePayment}
                  className="w-full mt-5 bg-[#164E70] hover:bg-[#0f364e] text-white font-medium py-3 rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? "Processing Booking..." : `Pay ₹${total}`}
                </button>
              </div>
            )}

            {/* CARD FORM */}
            {paymentMethod === "card" && (
              <div>
                <div className="mb-4">
                  <label className="text-xs text-gray-500 font-medium">Card Holder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      setError("");
                    }}
                    placeholder="Name as on card"
                    className="w-full mt-2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none text-sm focus:border-[#164E70]"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-xs text-gray-500 font-medium">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    maxLength="19"
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "").slice(0, 16);
                      value = value.replace(/(.{4})/g, "$1 ").trim();
                      setCardNumber(value);
                      setError("");
                    }}
                    placeholder="0000 0000 0000 0000"
                    className="w-full mt-2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none text-sm focus:border-[#164E70]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      maxLength="5"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (value.length >= 3) {
                          value = value.slice(0, 2) + "/" + value.slice(2);
                        }
                        setExpiry(value);
                        setError("");
                      }}
                      placeholder="MM/YY"
                      className="w-full mt-2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none text-sm focus:border-[#164E70]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-medium">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      maxLength="3"
                      onChange={(e) => {
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
                        setError("");
                      }}
                      placeholder="***"
                      className="w-full mt-2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none text-sm focus:border-[#164E70]"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePayment}
                  className="w-full mt-6 bg-[#164E70] hover:bg-[#0f364e] text-white font-medium py-3 rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? "Processing Booking..." : `Pay ₹${total}`}
                </button>
              </div>
            )}
          </div>

          {/* ================= BOOKING SUMMARY ================= */}
          <div className="bg-white rounded-xl p-5 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-[#164E70] mb-5">
              Booking Summary
            </h2>

            {event && (
              <div className="mb-4 pb-4 border-b border-gray-100 flex gap-3 items-center">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-bold text-sm text-gray-800">{event.title}</h3>
                  <p className="text-xs text-gray-500">{event.date} • {quantity} Ticket(s)</p>
                </div>
              </div>
            )}

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ticket Price ({quantity}x)</span>
                <span>₹{ticketPrice * quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Service Fee</span>
                <span>₹{serviceFee}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>₹{tax}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-base">
                <span>Amount Payable</span>
                <span className="text-[#164E70]">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;