import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/Api";

function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  return seconds;
}

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const emailFromState = state?.email || "";

  const [email] = useState(emailFromState);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resendSeconds = useMemo(() => 60, []);
  const countdown = useCountdown(resendSeconds);

  useEffect(() => {
    if (!email) {
      setError("Missing email. Please register again.");
    }
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    const cleanOtp = (otp || "").trim();
    if (!/^[0-9]{6}$/.test(cleanOtp)) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/auth/verify-otp", {
        email,
        otp: cleanOtp,
      });

      setSuccess("Email verified successfully");

      // Redirect to login after a moment
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message;
      setError(typeof msg === "string" ? msg : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    if (countdown > 0) return;

    setResending(true);
    try {
      await API.post("/api/auth/resend-otp", {
        email,
      });
      setSuccess("New OTP sent to your email");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message;
      setError(typeof msg === "string" ? msg : "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <h2>
            Electro<span>Mart</span>
          </h2>
        </div>

        <h1>Verify your email</h1>
        <p className="subtitle">Enter the 6-digit code sent to your email.</p>

        {error ? <p style={{ color: "#dc2626", marginBottom: 12 }}>{error}</p> : null}
        {success ? (
          <p style={{ color: "#16a34a", marginBottom: 12 }}>{success}</p>
        ) : null}

        <form className="auth-form" onSubmit={handleVerify}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP →"}
          </button>
        </form>

        <div className="divider">
          <span>Didn't get the code?</span>
        </div>

        <button
          type="button"
          className="primary-btn"
          style={{ background: "#0f172a" }}
          onClick={handleResend}
          disabled={resending || countdown > 0 || !email}
        >
          {resending
            ? "Resending..."
            : countdown > 0
              ? `Resend OTP (${countdown}s)`
              : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;

