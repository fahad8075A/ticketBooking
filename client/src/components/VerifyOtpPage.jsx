import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";

const getApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  return raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
};

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const redirectTo = location.state?.redirectTo || "/";
  const redirectState = location.state?.redirectState || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

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

    if (val && index < 5) {
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
    const pastedData = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6)
      .toUpperCase();
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const enteredCode = otp.join("").trim();

    if (enteredCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await fetch(`${getApiBaseUrl()}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredCode }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Invalid code. Please check and try again.");
      }

      const token = resData.data?.token || resData.token;
      const user = resData.data?.user || resData.user || { email, role: "user" };

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
      }
      localStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", user.role || "user");
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("authChange"));
      window.dispatchEvent(new Event("storage"));

      // Direct to Home page
      navigate(redirectTo, { state: redirectState, replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    try {
      setIsResending(true);
      setErrorMessage("");

      const response = await fetch(`${getApiBaseUrl()}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, channel: "email" }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to resend verification code.");
      }

      if (resData.devOtp) {
        alert(`Dev Mode OTP: ${resData.devOtp}`);
      }

      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07090e] text-zinc-100 flex flex-col font-sans overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[50rem] h-[24rem] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px] bg-[#0f1420] border border-zinc-800/90 rounded-[32px] p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col text-center">
          
          {/* Header Icon & Title */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Verify Security Code
            </h1>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-sm mx-auto">
              We sent a 6-digit confirmation code to{" "}
              <span className="text-white font-semibold">{email}</span>.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div
              className="flex justify-center items-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
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
                  placeholder="•"
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-black uppercase rounded-2xl bg-[#07090e] border transition-all duration-200 outline-none ${
                    char
                      ? "border-sky-400 text-white shadow-md shadow-sky-500/10 bg-[#0c101a]"
                      : "border-zinc-800 text-zinc-300 placeholder-zinc-700 focus:border-sky-500"
                  } disabled:opacity-40`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-12 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-sky-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Go Home</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend Actions */}
          <div className="mt-7 text-xs text-zinc-400">
            {timer > 0 ? (
              <p>
                Resend code in{" "}
                <span className="font-mono font-bold text-sky-400">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sky-400 hover:text-sky-300 font-bold transition cursor-pointer disabled:opacity-50"
              >
                {isResending ? "Sending code..." : "Resend Verification Code"}
              </button>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default VerifyOtpPage;