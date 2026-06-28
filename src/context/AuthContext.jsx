import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback
} from "react";
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


  const login = useCallback((userObj) => {
  const normalized = normalizeUser(userObj);

  setUser(normalized);

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(normalized)
  );

  navigate("/", { replace: true });

}, [navigate]);

  const logout = useCallback(() => {

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");

  setUser(null);

  navigate("/login", {
    replace: true,
  });

}, [navigate]);

 const value = useMemo(() => ({
  user,
  isAuthenticated: !!user,
  loading,
  login,
  logout,
}), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


