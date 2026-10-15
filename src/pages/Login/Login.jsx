import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn, useSignUp } from "@clerk/react";
import { isClerkAPIResponseError } from "@clerk/react/errors";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
} from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpStatus } = useSignUp();

  const [activeTab, setActiveTab] = useState("signin");
  const [verificationMode, setVerificationMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clerkError = (errors, fallback) =>
    errors?.fields?.emailAddress?.message ||
    errors?.fields?.password?.message ||
    errors?.fields?.code?.message ||
    errors?.global?.[0]?.message ||
    fallback;

  const finalize = async (future) => {
    await future.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");
        navigate(url, { replace: true });
      },
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error: resultError } = await signIn.password({
        emailAddress: email.trim().toLowerCase(),
        password,
      });

      if (resultError) {
        setError(
          isClerkAPIResponseError(resultError)
            ? resultError.errors?.[0]?.message || "Unable to sign in"
            : "Unable to sign in"
        );
        return;
      }

      if (signIn.status === "complete") {
        await finalize(signIn);
      } else {
        setError("Additional sign-in verification is required in Clerk.");
      }
    } catch (err) {
      setError(err?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanName = name.trim();
    const cleanEmail = signupEmail.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !signupPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error: resultError } = await signUp.password({
        emailAddress: cleanEmail,
        password: signupPassword,
      });

      if (resultError) {
        setError(
          isClerkAPIResponseError(resultError)
            ? resultError.errors?.[0]?.message || "Registration failed"
            : "Registration failed"
        );
        return;
      }

      if (cleanName) {
        await signUp.update({ firstName: cleanName });
      }

      await signUp.verifications.sendEmailCode();
      setVerificationMode(true);
      setCode("");
      setMessage(`Verification code sent to ${cleanEmail}. Check your email.`);
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const { error: resultError } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (resultError) {
        setError(
          isClerkAPIResponseError(resultError)
            ? resultError.errors?.[0]?.message || "Invalid verification code"
            : "Invalid verification code"
        );
        return;
      }

      if (signUp.status === "complete") {
        await finalize(signUp);
      } else {
        setError("Verification succeeded but the account still has missing requirements. Check Clerk Dashboard settings.");
      }
    } catch (err) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      const { error: resultError } = await signUp.verifications.sendEmailCode();
      if (resultError) {
        setError(
          isClerkAPIResponseError(resultError)
            ? resultError.errors?.[0]?.message || "Unable to resend code"
            : "Unable to resend code"
        );
        return;
      }
      setMessage("A new verification code was sent.");
    } catch (err) {
      setError(err?.message || "Unable to resend code");
    }
  };

  const fetching =
    loading || signInStatus === "fetching" || signUpStatus === "fetching";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <h2>Electro<span>Mart</span></h2>
        </div>

        {!verificationMode && (
          <div className="auth-tabs">
            <button
              type="button"
              className={activeTab === "signin" ? "active" : ""}
              onClick={() => {
                setActiveTab("signin");
                setError("");
                setMessage("");
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={activeTab === "signup" ? "active" : ""}
              onClick={() => {
                setActiveTab("signup");
                setError("");
                setMessage("");
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {error && <div className="auth-message error-message">{error}</div>}
        {message && <div className="auth-message success-message">{message}</div>}

        {verificationMode ? (
          <>
            <div className="otp-icon">✉</div>
            <h1>Verify your email</h1>
            <p className="subtitle">
              Enter the 6-digit code Clerk sent to <strong>{signupEmail}</strong>.
            </p>
            <form className="auth-form" onSubmit={handleVerify}>
              <div className="input-box otp-input-box">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="primary-btn" disabled={fetching}>
                {fetching ? "Verifying..." : "Verify Email →"}
              </button>
            </form>
            <div className="divider"><span>Didn't get the code?</span></div>
            <button type="button" className="resend-btn" onClick={handleResend} disabled={fetching}>
              Resend Verification Code
            </button>
            <button
              type="button"
              className="back-login-btn"
              onClick={() => {
                setVerificationMode(false);
                setCode("");
                setError("");
                setMessage("");
              }}
            >
              Back
            </button>
          </>
        ) : activeTab === "signin" ? (
          <>
            <h1>Welcome back!</h1>
            <p className="subtitle">Sign in securely with Clerk.</p>
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="input-box">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="input-box password-box">
                <FaLock />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Link to="/forgot-password" className="forgot">Forgot password?</Link>
              <button type="submit" className="primary-btn" disabled={fetching}>
                {fetching ? "Signing In..." : "Sign In →"}
              </button>
            </form>
            <div className="divider"><span>or continue with</span></div>
            <div className="social-buttons">
              <button type="button" disabled title="Google login can be enabled in Clerk Dashboard"><FaGoogle /> Google</button>
              <button type="button" disabled title="Apple login can be enabled in Clerk Dashboard"><FaApple /> Apple</button>
            </div>
          </>
        ) : (
          <>
            <h1>Join ElectroMart</h1>
            <p className="subtitle">Create an account and verify your email with an OTP.</p>
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="input-box">
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="input-box">
                <FaEnvelope />
                <input type="email" placeholder="john@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="input-box password-box">
                <FaLock />
                <input type={showSignupPassword ? "text" : "password"} placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={() => setShowSignupPassword((v) => !v)} aria-label={showSignupPassword ? "Hide password" : "Show password"}>
                  {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="input-box password-box">
                <FaLock />
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button type="submit" className="primary-btn" disabled={fetching}>
                {fetching ? "Sending Verification Code..." : "Create Account →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
