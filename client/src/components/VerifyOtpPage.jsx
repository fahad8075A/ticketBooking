import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect back if no email was passed in routing state
  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    const val = value.slice(-1).toUpperCase();
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 4).toUpperCase();
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 4) newOtp[idx] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
  };

  // Submit OTP to backend
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const enteredCode = otp.join("").trim();

    if (enteredCode.length < 4) {
      setErrorMessage("Please enter the complete 4-character code.");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredCode }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Verification failed. Try again.");
      }

      // Store auth session details from backend response
      const token = resData.data?.token;
      const user = resData.data?.user || {};

      if (token) localStorage.setItem("authToken", token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", user.role || "user");

      window.dispatchEvent(new Event("authChange"));
      navigate("/profile", { state: { email }, replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // Request backend to send a new OTP
  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    try {
      setIsResending(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, channel: "email" }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to resend verification code.");
      }

      setTimer(60);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50 backdrop-brightness-90" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-8 sm:p-10 shadow-2xl text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Verify Your Email Address <br /> To Sign In
          </h2>
          <p className="text-gray-200 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto mb-6 font-normal">
            We sent a verification code to <span className="font-semibold">{email}</span>. Enter this code to continue.
          </p>

          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center items-center gap-3 sm:gap-4" onPaste={handlePaste}>
              {otp.map((char, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={char}
                  disabled={isVerifying}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="-"
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-lg sm:text-xl font-bold uppercase rounded-xl bg-white/15 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/25 transition shadow-inner disabled:opacity-50"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#c67d1f] hover:bg-[#b06f19] active:scale-[0.99] text-white font-medium text-sm py-3.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify email"}
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-200 leading-relaxed max-w-xs mx-auto">
            {timer > 0 ? (
              <p>
                Didn't get an email? Check your spam folder or request another code in{" "}
                <span className="font-semibold text-white">{timer} seconds</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-amber-400 hover:text-amber-300 font-semibold underline transition cursor-pointer disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend Verification Code"}
              </button>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-white hover:text-gray-200 transition cursor-pointer"
            >
              Back To Sign-In
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtpPage;