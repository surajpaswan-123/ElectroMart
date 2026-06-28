import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AUTH_STORAGE_KEY = "user";

const normalizeUser = (u) => {
  if (!u) return null;
  if (typeof u === "string") {
    try {
      return JSON.parse(u);
    } catch {
      return null;
    }
  }
  return u;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const parsedUser = normalizeUser(rawUser);

    // If we have a token but no stored user, keep auth state consistent by using a minimal user stub.
    // ProtectedRoute relies on AuthContext state.
    const token = localStorage.getItem("token");

    if (parsedUser) {
      setUser(parsedUser);
    } else if (token) {
      // Minimal placeholder to prevent redirect loops on refresh.
      setUser({ email: "", name: "" });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);


  const login = (userObj) => {
    const normalized = normalizeUser(userObj);

    setUser(normalized);

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));

    // Login ke baad Home page
    navigate("/", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("token");

    setUser(null);

    // Browser history me protected pages nahi rahenge
    navigate("/login", { replace: true });
  };

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    };
  }, [user, loading]);








  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


