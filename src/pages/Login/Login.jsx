import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import API from "../../api/Api";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaGoogle,
  FaApple,
} from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
 const navigate = useNavigate();

 const [name, setName] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] =useState("");
const [confirmPassword, setConfirmPassword] =
  useState("");
 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post(
      "/api/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    alert("Login Successful");

    navigate("/");
  } catch (error) {
    alert(
      error.response?.data ||
      "Invalid Email or Password"
    );
  }
};

const handleRegister = async (e) => {
  e.preventDefault();

  if (signupPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await API.post("/api/auth/register", {
      name,
      email: signupEmail,
      password: signupPassword,
    });

    alert("Registration Successful");

    setActiveTab("signin");

    setName("");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmPassword("");
  } catch (error) {
    alert(
      error.response?.data ||
      "Registration Failed"
    );
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

        <div className="auth-tabs">
          <button
            className={activeTab === "signin" ? "active" : ""}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>

          <button
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Create Account
          </button>
        </div>

        {activeTab === "signin" ? (
          <>
            <h1>Welcome back!</h1>

            <p className="subtitle">
              Sign in to your account to continue.
            </p>

           <form
  className="auth-form"
  onSubmit={handleLogin}
>
              <div className="input-box">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-box">
                <FaLock />
                <input
  type="password"
  placeholder="••••••••"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
/>
                <FaEye className="eye" />
              </div>

              <Link
                to="/forgot-password"
                className="forgot"
              >
                Forgot password?
              </Link>

              <button
                type="submit"
                className="primary-btn"
              >
                Sign In →
              </button>
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button type="button">
                <FaGoogle />
                Google
              </button>

              <button type="button">
                <FaApple />
                Apple
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>Join ElectroMart</h1>

            <p className="subtitle">
              Create an account to get the best deals.
            </p>

            <form
  className="auth-form"
  onSubmit={handleRegister}
>
              <div className="input-box">
               <input
  type="text"
  placeholder="John Doe"
  value={name}
  onChange={(e) =>
    setName(e.target.value)
  }
/>
              </div>

              <div className="input-box">
                <FaEnvelope />
               <input
  type="email"
  placeholder="john@example.com"
  value={signupEmail}
  onChange={(e) =>
    setSignupEmail(e.target.value)
  }
/>
              </div>

              <div className="input-box">
                <FaLock />
               <input
  type="password"
  placeholder="Password"
  value={signupPassword}
  onChange={(e) =>
    setSignupPassword(e.target.value)
  }
/>
              </div>

              <div className="input-box">
                <FaLock />
                <input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(e.target.value)
  }
/>
              </div>

              <button
                type="submit"
                className="primary-btn"
              >
                Create Account →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}