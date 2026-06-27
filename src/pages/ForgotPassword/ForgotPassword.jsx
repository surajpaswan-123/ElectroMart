import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    alert(`Reset link will be sent to ${email}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Reset Password</h1>

        <p className="subtitle">
          Enter your email address and we'll send you a password reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={handleReset}
        >
          Send Reset Link
        </button>

        <Link
          to="/"
          className="back-link"
        >
          ← Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ForgotPassword;