import axios from "axios";
import { BACKEND_URL } from "../config";

// Public API (no auth header)
export const publicApi = axios.create({
  baseURL: BACKEND_URL,
});

// Authenticated API (token from localStorage on every request)
export const authApi = axios.create({
  baseURL: BACKEND_URL,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
