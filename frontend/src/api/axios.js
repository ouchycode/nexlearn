import axios from "axios";

const instance = axios.create({
  // Jika sudah dideploy, ganti localhost ini dengan URL Vercel Backend kamu
  baseURL: "https://nexlearn-api.vercel.app/api",
});

// Otomatis masukkan token jika ada di localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default instance;
