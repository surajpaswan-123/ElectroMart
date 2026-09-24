import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const AUTH_STORAGE_KEY = "user";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.__clerkGetToken = getToken;
    return () => {
      delete window.__clerkGetToken;
    };
  }, [getToken]);

  const syncUser = useCallback(async () => {
    if (!isSignedIn || !clerkUser) {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setLoading(false);
      return;
    }

    try {
      const primaryEmail =
        clerkUser.primaryEmailAddress?.emailAddress ||
        clerkUser.emailAddresses?.[0]?.emailAddress ||
        "";

      const response = await API.post("/api/auth/clerk/sync", {
        name: clerkUser.fullName || clerkUser.firstName || "ElectroMart User",
        email: primaryEmail,
      });

      const localUser = response.data;
      setUser(localUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
    } catch (error) {
      console.error("Clerk user sync failed:", error);
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, clerkUser]);

  useEffect(() => {
    setLoading(true);
    syncUser();
  }, [syncUser]);

  const login = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const logout = useCallback(async () => {
    await signOut();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate, signOut]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!isSignedIn && !!user,
      loading,
      login,
      logout,
    }),
    [user, isSignedIn, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
