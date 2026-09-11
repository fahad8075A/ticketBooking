import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// Standardized environment variable definition
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTo = location.state?.redirectTo || "/";
  const redirectState = location.state?.redirectState || {};

  useEffect(() => {
    const isAuth =
      sessionStorage.getItem("isAuthenticated") === "true" ||
      localStorage.getItem("isAuthenticated") === "true";

    if (isAuth) {
      navigate(redirectTo, { state: redirectState, replace: true });
    }
  }, [navigate, redirectTo, redirectState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage("");

  try {
  const response = await fetch(`${API_BASE_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  // Safely parse JSON only if available; avoid crashing on HTML 404/500
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || `Error ${response.status}: Route not found on server.`
    );
  }

  // If backend runs in mock/dev mode without SMTP, show OTP alert
  if (data?.devOtp) {
    alert(`Dev Mode OTP: ${data.devOtp}`);
  }

  // Navigate to OTP entry screen without passing the plaintext code
  navigate("/verify-otp", {
    state: {
      email: email.trim(),
      redirectTo,
      redirectState,
    },
  });
} catch (error) {
  setErrorMessage(error.message);
} finally {
  setLoading(false);
}
  };

  const handleGuestLogin = () => {
    const guestData = {
      role: "guest",
      email: "Guest User",
      isAuthenticated: "true",
    };

    Object.entries(guestData).forEach(([key, val]) => {
      sessionStorage.setItem(key, val);
      localStorage.setItem(key, val);
    });

    window.dispatchEvent(new Event("authChange"));
    navigate(redirectTo, { state: redirectState, replace: true });
  };

  const handleSocialLogin = (provider) => {
    // In production: window.location.href = `${API_BASE_URL}/${provider.toLowerCase()}`;
    const mockEmail = `${provider.toLowerCase()}user@flexibook.com`;
    sessionStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("userEmail", mockEmail);
    localStorage.setItem("userEmail", mockEmail);
    sessionStorage.setItem("userRole", "user");
    localStorage.setItem("userRole", "user");

    window.dispatchEvent(new Event("authChange"));
    navigate(redirectTo, { state: redirectState, replace: true });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-slate-900/45 backdrop-brightness-90" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px] bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 sm:p-10 shadow-2xl text-white">
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Sign In Or <br /> Create An Account
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto font-normal">
              Sign in to your account to access our services and manage your bookings.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-bold tracking-wider text-gray-300 uppercase mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/10 border border-white/25 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c67d1f] hover:bg-[#b06f19] active:scale-[0.99] text-white font-medium text-sm py-3 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Continue with Email"}
            </button>
          </form>

         

          <div className="flex justify-center items-center gap-4">
           
           
          </div>

          <div className="mt-7 pt-5 border-t border-white/15 text-center">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="text-xs text-gray-200 hover:text-white font-medium tracking-wide underline underline-offset-4 transition cursor-pointer"
            >
              Continue as Guest →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;