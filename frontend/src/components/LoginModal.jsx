import React, { useState } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API kita
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// Icons
import { X, Mail, Lock, LogIn } from "lucide-react";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menggunakan API instance (URL disingkat karena baseUrl sudah ada di API instance)
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Tutup modal dulu biar smooth
      onClose();

      // SweetAlert Sukses
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang kembali, ${res.data.user.name} 👋`,
        showConfirmButton: false,
        timer: 1500,
        background: "#fff",
        color: "#1f2937",
      });

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
        window.location.reload();
      }, 1500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Masuk",
        text: err.response?.data?.msg || "Email atau password salah",
        confirmButtonColor: "#7c3aed",
        background: "#fff",
        color: "#1f2937",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 transition-all duration-300">
      <div className="bg-bg-card border border-border-color w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main hover:bg-bg-main p-2 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-text-main mb-2">
              Masuk Akun 👋
            </h2>
            <p className="text-text-muted text-sm font-medium">
              Lanjutkan progres belajar kamu hari ini di NexLearn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50 font-medium"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50 font-medium"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Memproses..."
              ) : (
                <>
                  Masuk Sekarang <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted font-medium">
            Belum punya akun?{" "}
            <button
              onClick={onSwitchToRegister}
              className="font-bold text-primary hover:underline"
            >
              Daftar Gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
