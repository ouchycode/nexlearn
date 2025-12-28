import React, { useState, useLayoutEffect, useRef } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Icons & Libs
import { User, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";

const Register = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // --- ANIMASI GSAP ---
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".register-anim", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menggunakan API.post (URL baseUrl otomatis dihandle)
      await API.post("/auth/register", form);

      // SweetAlert Sukses
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil! 🎉",
        text: "Akun Anda telah dibuat. Silakan login untuk melanjutkan.",
        confirmButtonText: "Siap Login",
        confirmButtonColor: "#7c3aed",
        background: "#fff",
        color: "#1f2937",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Daftar",
        text: err.response?.data?.msg || "Terjadi kesalahan sistem",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main font-sans transition-colors duration-500 flex flex-col"
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-10">
        <div className="max-w-md w-full bg-bg-card border border-border-color rounded-3xl shadow-glow overflow-hidden p-8 relative register-anim">
          {/* Tombol Balik Kecil */}
          <Link
            to="/"
            className="absolute top-6 left-6 text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <UserPlus size={24} />
            </div>
            <h2 className="text-3xl font-black text-text-main leading-tight">
              Buat Akun Baru
            </h2>
            <p className="text-text-muted mt-2 text-sm">
              Gabung komunitas belajar NexLearn sekarang.
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50 font-medium"
                  name="name"
                  type="text"
                  placeholder="Nama lengkap kamu..."
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50 font-medium"
                  name="email"
                  type="email"
                  placeholder="contoh@email.com"
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-text-muted/50 font-medium"
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
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <p className="mt-8 text-center text-sm text-text-muted font-medium">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:underline transition-colors"
            >
              Masuk Disini
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
