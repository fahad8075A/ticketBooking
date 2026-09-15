import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, UserCheck } from "lucide-react";

// Centralized base URL helper
const getApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  return raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    const isAuth =
      sessionStorage.getItem("isAuthenticated") === "true" ||
      localStorage.getItem("isAuthenticated") === "true";

    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          channel: "email",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Error ${response.status}: Failed to dispatch verification code.`
        );
      }

      if (data?.devOtp) {
        alert(`Dev Mode OTP: ${data.devOtp}`);
      }

      // Pass redirectTo: "/" so VerifyOtpPage routes home on completion
      navigate("/verify-otp", {
        state: {
          email: email.trim().toLowerCase(),
          redirectTo: "/",
          redirectState: {},
        },
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      _id: "guest-session-id",
      name: "Guest Explorer",
      email: "guest@flexibook.com",
      role: "guest",
      isGuest: true,
    };

    sessionStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("userRole", "guest");
    localStorage.setItem("userRole", "guest");
    sessionStorage.setItem("userEmail", guestUser.email);
    localStorage.setItem("userEmail", guestUser.email);
    sessionStorage.setItem("user", JSON.stringify(guestUser));
    localStorage.setItem("user", JSON.stringify(guestUser));

    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("storage"));

    // Route directly to home page
    navigate("/", { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07090e] text-zinc-100 flex flex-col font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[50rem] h-[24rem] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-[#0f1420] border border-zinc-800/90 rounded-[32px] p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col">
          
          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome to Flexi<span className="text-sky-400">Book</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Sign in or authenticate with your email to view, book, and manage your tickets.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Email OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="passenger@flexibook.com"
                className="w-full h-12 px-4 bg-[#0b0e17] border border-zinc-800 rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-sky-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-sky-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Sending One-Time Code..." : "Continue with Email"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guest Access Alternative */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-semibold transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Continue as Guest Passenger →</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LoginPage;