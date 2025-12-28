import React, { useState } from "react";
import API from "../api/axios"; // <--- GANTI INI (Pakai instance API kita)
import Swal from "sweetalert2";
// Icons
import { X, User, Mail, Lock, UserPlus } from "lucide-react";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // GUNAKAN API.post AGAR BASE URL OTOMATIS TER-HANDLE
      // Backend route: /api/auth/register
      await API.post("/auth/register", form);

      // Tutup modal dulu
      onClose();

      // SweetAlert Sukses
      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil! 🎉",
        text: "Akun Anda telah dibuat. Silakan login untuk melanjutkan.",
        confirmButtonText: "Oke, Siap Login!",
        confirmButtonColor: "#7c3aed",
        background: "#fff",
        color: "#1f2937",
      }).then(() => {
        // Pindah ke Login Modal setelah popup ditutup
        onSwitchToLogin();
      });
    } catch (err) {
      // SweetAlert Error
      Swal.fire({
        icon: "error",
        title: "Gagal Daftar",
        text: err.response?.data?.msg || "Terjadi kesalahan saat pendaftaran",
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
      {/* Container Modal */}
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
              Buat Akun Baru 🚀
            </h2>
            <p className="text-text-muted text-sm">
              Gabung komunitas dan mulai belajar skill baru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Nama */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50"
                  name="name"
                  type="text"
                  placeholder="Nama Kamu"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50"
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50"
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
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Mendaftarkan..."
              ) : (
                <>
                  Daftar Sekarang <UserPlus size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Sudah punya akun?{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-bold text-primary hover:underline"
            >
              Masuk Disini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
