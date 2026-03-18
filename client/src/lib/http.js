import axios from "axios";
import { API_BASE_URL } from "./config";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";
    const normalized = String(message).toLowerCase();

    if (
      status === 401 ||
      status === 409 ||
      normalized.includes("invalid signature") ||
      normalized.includes("not authorized") ||
      normalized.includes("invalid authentication")
    ) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userId");
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);
