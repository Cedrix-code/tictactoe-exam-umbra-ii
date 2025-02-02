import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tictacohh-ii-server.onrender.com/api',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simplified request interceptor without unsafe Origin header
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error("Resource not found:", error.config.url);
      throw new Error(`Resource not found: ${error.config.url}`);
    }

    if (!error.response) {
      console.error("Network error:", error.message);
      throw new Error("Network error. Please check your connection.");
    }

    console.error("API Error:", error);
    throw error;
  }
);

export default api;
