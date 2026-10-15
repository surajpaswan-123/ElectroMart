import axios from "axios";

const API_BASE_URL = "https://electromart-backend-w5kf.onrender.com";

const API = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || API_BASE_URL)
    .trim()
    .replace(/\/+$/, ""),
});

API.interceptors.request.use(async (config) => {
  try {
    const getToken = window.__clerkGetToken;
    if (typeof getToken === "function") {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Unable to get Clerk session token:", error);
  }

  return config;
});

export default API;
