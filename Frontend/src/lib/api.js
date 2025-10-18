import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : `${import.meta.env.VITE_API_URL}/api`; // ensure /api is included

console.log("API base URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// ✅ Simple version — no token or interceptors
api.interceptors.request.use(
  (config) => {
    // You can still customize headers here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just forward the error, no auth redirect
    return Promise.reject(error);
  }
);

export default api;
