import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/Api";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaApple } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const messageFromError = (error, fallback) => {
    const data = error?.response?.data;
    if (typeof data === "string") return data;
    return data?.message || error?.message || fallback;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/api/auth/login", { email: cleanEmail, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      setError(messageFromError(error, "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
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
      await API.post("/api/auth/register", { name: cleanName, email: cleanEmail, password: signupPassword });
      sessionStorage.setItem("electromart_pending_email", cleanEmail);
      navigate("/verify-otp", { state: { email: cleanEmail } });
    } catch (error) {
      setError(messageFromError(error, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo"><div className="logo-icon">⚡</div><h2>Electro<span>Mart</span></h2></div>
        <div className="auth-tabs">
          <button type="button" className={activeTab === "signin" ? "active" : ""} onClick={() => { setActiveTab("signin"); setError(""); }}>Sign In</button>
          <button type="button" className={activeTab === "signup" ? "active" : ""} onClick={() => { setActiveTab("signup"); setError(""); }}>Create Account</button>
        </div>
        {error && <div className="auth-message error-message">{error}</div>}

        {activeTab === "signin" ? (
          <>
            <h1>Welcome back!</h1>
            <p className="subtitle">Sign in to your account to continue.</p>
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="input-box"><FaEnvelope /><input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
              <div className="input-box password-box"><FaLock /><input type={showLoginPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /><button type="button" className="password-toggle" onClick={() => setShowLoginPassword((v) => !v)} aria-label={showLoginPassword ? "Hide password" : "Show password"}>{showLoginPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              <Link to="/forgot-password" className="forgot">Forgot password?</Link>
              <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Signing In..." : "Sign In →"}</button>
            </form>
            <div className="divider"><span>or continue with</span></div>
            <div className="social-buttons"><button type="button" disabled title="Google login is not configured yet"><FaGoogle /> Google</button><button type="button" disabled title="Apple login is not configured yet"><FaApple /> Apple</button></div>
          </>
        ) : (
          <>
            <h1>Join ElectroMart</h1>
            <p className="subtitle">Create an account and verify your email with OTP.</p>
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="input-box"><input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></div>
              <div className="input-box"><FaEnvelope /><input type="email" placeholder="john@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required autoComplete="email" /></div>
              <div className="input-box password-box"><FaLock /><input type={showSignupPassword ? "text" : "password"} placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} autoComplete="new-password" /><button type="button" className="password-toggle" onClick={() => setShowSignupPassword((v) => !v)} aria-label={showSignupPassword ? "Hide password" : "Show password"}>{showSignupPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              <div className="input-box password-box"><FaLock /><input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" /><button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              <button type="submit" className="primary-btn" disabled={loading}>{loading ? "Sending OTP..." : "Create Account →"}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
