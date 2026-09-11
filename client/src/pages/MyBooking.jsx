import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
    FaUser,
    FaPhoneAlt,
    FaEnvelope,
    FaShieldAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyBooking = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const event = state?.event;
    const ticketType = state?.ticketType || "Standard Entry";
    const ticketPrice = Number(state?.ticketPrice || event?.price || 0);

    const [quantity, setQuantity] = useState(1);
    const [promo, setPromo] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const serviceFee = 99;
    const tax = 119;

    const total =
        ticketPrice * quantity +
        serviceFee +
        tax;

    return (
        <div className="min-h-screen bg-[#f6f8fc]">

            {/* Heading */}
            <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
                <h1 className="text-5xl font-bold text-[#143d79]">
                    Secure Your Tickets
                </h1>

                <p className="text-gray-500 mt-2 text-lg">
                    Verify your selection and complete your payment safely.
                </p>
            </div>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto px-6 pb-12">

                <div className="grid lg:grid-cols-[2fr_1fr] gap-10">

                    {/* ================= Left Card ================= */}

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

                        {/* Card Heading */}

                        <div className="flex items-center gap-3 mb-8">

                            <FaUser className="text-orange-500 text-lg" />

                            <h2 className="text-3xl font-bold text-[#143d79]">
                                Passenger / Contact Information
                            </h2>

                        </div>

                        

                        <div className="mb-6">

                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                Full Name
                            </label>

                            <div className="relative">

                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John"
                                    className="w-full h-14 pl-12 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#143d79]"
                                />

                            </div>

                        </div>
                    


                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                Phone Number
                            </label>

                            <div className="relative">

                                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 7306234185"
                                    className="w-full h-14 pl-12 rounded-xl border border-gray-300"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                Email Address
                            </label>

                            <div className="relative">

                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. john@gmail.com"
                                    className="w-full h-14 pl-12 rounded-xl border border-gray-300"
                                />

                            </div>

                        </div>

                    </div>


                    <div className="mt-8 border border-blue-100 rounded-xl bg-[#f8fbff] p-6">

                        <div className="flex items-start gap-4">

                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">

                                <FaShieldAlt className="text-orange-500" />

                            </div>

                            <div>

                                <h3 className="font-bold text-[#143d79] text-lg">
                                    Secure Checkout Sandbox Mode
                                </h3>

                                <p className="text-sm text-gray-500 leading-6 mt-2">
                                    FlexiBook leverages sandbox payment simulation.
                                    No actual credit card information is required or stored.
                                    Your credentials and mock booking confirmations are safely
                                    handled within your browser session.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="grid grid-cols-2 gap-5 mt-10">

                        <button className="h-14 rounded-xl border border-[#143d79] text-[#143d79] font-semibold hover:bg-gray-100 transition">
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                if (!name.trim()) {
                                    alert("Please enter your name");
                                    return;
                                }

                                if (!phone.trim()) {
                                    alert("Please enter your phone number");
                                    return;
                                }

                                if (!email.trim()) {
                                    alert("Please enter your email address");
                                    return;
                                }

                                navigate("/payment", {
                                    state: {
                                        event: event,
                                        ticketType: ticketType,
                                        ticketPrice: ticketPrice,
                                        serviceFee: serviceFee,
                                        tax: tax,
                                        total: total,
                                        quantity: quantity,
                                        name: name,
                                        phone: phone,
                                        email: email,
                                    },
                                });
                            }}
                            className="bg-[#164E70] text-white px-6 py-3 rounded-md"
                        >
                            Pay & Secure Ticket
                        </button>

                    </div>

                </div>

                {/* ================= Right Card ================= */}
                {/* ================= Right Card ================= */}

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-fit">

                    {/* Heading */}
                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-orange-500 text-xl">🎫</span>
                        <h2 className="text-2xl font-bold text-[#143d79]">
                            Booking Details
                        </h2>
                    </div>

                    <hr className="mb-5" />

                    {/* Event Info */}
                    <div className="flex gap-4">

                        <img
                            src={event?.image}
                            alt={event?.title}
                            className="w-24 h-24 rounded-xl object-cover"
                        />

                        <div className="flex-1">

                            <span className="bg-gray-100 text-[#143d79] text-xs font-semibold px-3 py-1 rounded-full">
                                {event?.category}
                            </span>

                            <h3 className="font-bold text-lg mt-3 text-[#143d79]">
                                {event?.title}
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                {event?.date}
                            </p>

                            <p className="text-gray-500 text-sm">
                                {event?.location}
                            </p>

                        </div>

                    </div>

                    <hr className="my-6 border-dashed" />

                    {/* Tier */}
                    <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">

                        <div>
                            <h4 className="font-semibold text-[#143d79]">
                                Tier Selected
                            </h4>

                            <p className="text-gray-500 text-sm">
                                {ticketType}
                            </p>
                        </div>

                        <span className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm font-semibold">
                            ₹{ticketPrice}
                        </span>

                    </div>

                    {/* Quantity */}

                    <div className="mt-7">

                        <div className="flex justify-between items-center">

                            <div>

                                <h4 className="font-semibold text-[#143d79]">
                                    Ticket Quantity
                                </h4>

                                <p className="text-sm text-gray-500">
                                    Limit 10 Tickets Per Customer
                                </p>

                            </div>

                            <div className="flex items-center rounded-xl border overflow-hidden">

                                <button
                                    onClick={() =>
                                        quantity > 1 &&
                                        setQuantity(quantity - 1)
                                    }
                                    className="w-10 h-10 bg-gray-100 text-xl"
                                >
                                    -
                                </button>

                                <span className="w-12 text-center font-bold">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        quantity < 10 &&
                                        setQuantity(quantity + 1)
                                    }
                                    className="w-10 h-10 bg-gray-100 text-xl"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    </div>

                    <div className="mt-7">

                        <div className="flex justify-between mb-2">

                            <span className="text-xs text-gray-500">
                                PROMO CODE
                            </span>

                            <span className="text-xs text-orange-500">
                                Try WELCOME20
                            </span>

                        </div>

                        <div className="flex gap-3">

                            <input
                                type="text"
                                value={promo}
                                onChange={(e) =>
                                    setPromo(e.target.value)
                                }
                                placeholder="Enter Promo Code"
                                className="flex-1 border rounded-xl px-4 h-12 outline-none"
                            />

                            <button className="bg-[#143d79] text-white px-6 rounded-xl">
                                Apply
                            </button>

                        </div>

                    </div>



                    <div className="space-y-4 mt-7">

                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Ticket(s) Price
                            </span>

                            <span>
                                ₹{ticketPrice * quantity}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Convenience Fee
                            </span>

                            <span>
                                ₹{serviceFee}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Local Transit Tax
                            </span>

                            <span>
                                ₹{tax}
                            </span>

                        </div>

                    </div>

                    <hr className="my-6 border-dashed" />

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Amount Payable
                            </p>

                            <h2 className="text-3xl font-bold text-[#143d79]">
                                ₹{total}
                            </h2>

                        </div>

                    </div>

                </div>



            </div>

        </div>

        </div >
    );
};

export default MyBooking;