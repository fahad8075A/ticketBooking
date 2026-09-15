import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

// Normalize base URL to always point to standard backend API
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const cleanBase = rawUrl.replace(/\/+$/, "").replace(/\/api(\/v1)?$/i, "");
const API_BASE_URL = `${cleanBase}/api/v1`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Primary attempt: /api/v1/auth/admin/login
      let endpoint = `${API_BASE_URL}/auth/admin/login`;
      let res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Secondary attempt: Fallback to /auth/admin/login if base router doesn't use /api/v1
      if (res.status === 404) {
        endpoint = `${cleanBase}/auth/admin/login`;
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to sign in as admin.");
      }

      const receivedToken = data.token || data.data?.token;
      const receivedUser = data.user || data.data?.user || {};
      const userEmail = receivedUser.email || formData.email;

      // 1. Wipe any leftover guest or conflicting session data
      localStorage.clear();

      // 2. Set all storage keys required across layouts, route guards, and API headers
      localStorage.setItem("authToken", receivedToken);
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("role", "admin");
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("isAuthenticated", "true");

      // 3. Persist clean user session object (clearing out any prior guest flags)
      const adminProfile = {
        ...receivedUser,
        email: userEmail,
        role: "admin",
        isAdmin: true,
        isGuest: false,
      };

      localStorage.setItem("user", JSON.stringify(adminProfile));
      localStorage.setItem("currentUser", JSON.stringify(adminProfile));

      // 4. Notify any auth listeners and redirect directly to the admin portal
      window.dispatchEvent(new Event("authChange"));
      navigate("/admin/bookings");
    } catch (err) {
      setError(err.message || "Unable to reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 sm:p-10">
        {/* Header Icon & Title */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-4 text-[#194569]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            FlexiBook Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access system bookings, users, and manifests.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@flexibook.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#194569] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#194569] focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#194569] hover:bg-[#133754] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            &larr; Return to Live Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;