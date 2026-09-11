import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/Api";
import "./Login/Login.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || sessionStorage.getItem("electromart_pending_email") || "");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
      sessionStorage.setItem("electromart_pending_email", stateEmail);
    }
  }, [location.state]);

  useEffect(() => {
    if (!email) setError("Missing email. Please register again.");
  }, [email]);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const getMessage = (err, fallback) => {
    const data = err?.response?.data;
    if (typeof data === "string") return data;
    return data?.message || err?.message || fallback;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const cleanOtp = otp.trim();
    if (!email) return setError("Missing email. Please register again.");
    if (!/^\d{6}$/.test(cleanOtp)) return setError("Enter a valid 6-digit OTP");

    setLoading(true);
    try {
      await API.post("/api/auth/verify-otp", { email, otp: cleanOtp });
      sessionStorage.removeItem("electromart_pending_email");
      setSuccess("Email verified successfully. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(getMessage(err, "OTP verification failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    if (!email) return setError("Missing email. Please register again.");
    if (countdown > 0 || resending) return;

    setResending(true);
    try {
      await API.post("/api/auth/resend-otp", { email });
      setOtp("");
      setCountdown(60);
      setSuccess("New OTP sent. Check your inbox.");
    } catch (err) {
      setError(getMessage(err, "Failed to resend OTP"));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card otp-card">
        <div className="logo"><div className="logo-icon">⚡</div><h2>Electro<span>Mart</span></h2></div>
        <div className="otp-icon">✉</div>
        <h1>Verify your email</h1>
        <p className="subtitle">We sent a 6-digit verification code to:</p>
        <div className="otp-email">{email || "your email address"}</div>
        {error && <div className="auth-message error-message">{error}</div>}
        {success && <div className="auth-message success-message">{success}</div>}

        <form className="auth-form" onSubmit={handleVerify}>
          <label className="otp-label" htmlFor="otp">Verification code</label>
          <div className="input-box otp-input-box">
            <input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} required autoFocus />
          </div>
          <button type="submit" className="primary-btn" disabled={loading || !email}>
            {loading ? "Verifying..." : "Verify OTP →"}
          </button>
        </form>

        <div className="divider"><span>Didn't get the code?</span></div>
        <button type="button" className="resend-btn" onClick={handleResend} disabled={resending || countdown > 0 || !email}>
          {resending ? "Sending..." : countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
        </button>
        <button type="button" className="back-login-btn" onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    </div>
  );
}

export default VerifyOTP;
