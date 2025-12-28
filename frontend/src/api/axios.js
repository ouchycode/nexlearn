import axios from "axios";

// Cek status environment (Development atau Production)
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api" // URL Localhost (Backend)
    : "/api"; // URL Production (Vercel)

const instance = axios.create({
  baseURL: baseURL,
});

// Otomatis masukkan token jika ada di LocalStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
