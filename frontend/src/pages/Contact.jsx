import React, { useState, useRef, useLayoutEffect } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API kita
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  MessageSquare,
  ArrowRight,
  Instagram,
  Github,
} from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";

const Contact = () => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".header-anim", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".info-card", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        delay: 0.5,
        clearProps: "all",
      });
      gsap.from(".form-container", {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
        clearProps: "all",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HANDLER SUBMIT MENGGUNAKAN API INSTANCE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Cukup panggil /contact, baseUrl sudah dihandle di api/axios.js
      const res = await API.post("/contact", formData);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Pesan Terkirim! 🚀",
          text: `Halo ${formData.name}, pesan kamu sudah masuk. Tunggu balasannya ya!`,
          confirmButtonColor: "#7c3aed",
        });
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Waduh, Gagal!",
        text: "Sepertinya ada gangguan server. Coba lagi nanti ya!",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main transition-colors duration-500"
    >
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="header-anim inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
            <MessageSquare size={14} />
            <span>Customer Support 24/7</span>
          </div>
          <h1 className="header-anim text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Let's Start a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              Conversation.
            </span>
          </h1>
          <p className="header-anim text-text-muted text-lg leading-relaxed">
            Punya ide kolaborasi? Atau bingung cara akses kursus? Santai aja,
            curhat di sini gratis kok. 👇
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="info-card group bg-bg-card border border-border-color p-6 rounded-3xl hover:border-primary/50 hover:shadow-glow transition-all duration-300 flex items-start gap-5">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-text-main mb-1">
                  Markas Besar
                </h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  Jl. Aria Santika No.40A, Karawaci, Kota Tangerang, Banten.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="info-card group bg-bg-card border border-border-color p-6 rounded-3xl hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h4 className="font-bold text-lg text-text-main mb-1">Email</h4>
                <p className="text-text-muted text-sm">23050472@uym.ac.id</p>
              </div>

              <div className="info-card group bg-bg-card border border-border-color p-6 rounded-3xl hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold text-lg text-text-main mb-1">
                  Whatsapp
                </h4>
                <p className="text-text-muted text-sm">+62 812 1933 4093</p>
              </div>
            </div>

            <div className="info-card bg-gradient-to-r from-primary to-purple-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12">
                <MessageSquare size={100} />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">
                Connect With Us!
              </h3>
              <div className="flex gap-4 relative z-10">
                <SocialBtn
                  icon={<Instagram size={20} />}
                  href="https://instagram.com/kevinnardd_"
                />
                <SocialBtn
                  icon={<Github size={20} />}
                  href="https://github.com/ouchycode"
                />
              </div>
            </div>
          </div>

          <div className="form-container bg-bg-card border border-border-color p-8 md:p-10 rounded-3xl shadow-sm relative overflow-hidden">
            <h3 className="text-2xl font-black text-text-main mb-6 flex items-center gap-2 relative z-10">
              Kirim Pesan <ArrowRight className="text-primary" size={24} />
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="group">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Siapa nama kamu?"
                  className="w-full px-5 py-4 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full px-5 py-4 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">
                  Ceritain Kendalamu
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tulis aja, gak usah sungkan..."
                  className="w-full px-5 py-4 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none transition-all resize-none font-medium"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-text-main text-bg-main hover:bg-primary hover:text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Mengirim..."
                ) : (
                  <>
                    Kirim Sekarang <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const SocialBtn = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-primary flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
  >
    {icon}
  </a>
);

export default Contact;
