import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API kita
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Icons & Libs
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";

const Profile = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Profile Data menggunakan API Instance
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Cukup panggil /users/me, baseUrl & token sudah dihandle api/axios.js
        const res = await API.get("/users/me");

        setUser(res.data);
        setNewName(res.data.name);
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat profil:", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // 2. GSAP Animation
  useEffect(() => {
    if (!loading && user) {
      let ctx = gsap.context(() => {
        gsap.from(".profile-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
        gsap.from(".stat-card", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "back.out(1.2)",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, user]);

  // Handle Update Nama
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Menggunakan API instance untuk PUT request
      await API.put("/users/profile", { name: newName });

      setUser({ ...user, name: newName });
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profil Diupdate!",
        text: "Nama berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
        background: "#fff",
        color: "#1f2937",
      });
    } catch (err) {
      Swal.fire("Error", "Gagal update profil", "error");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-text-muted font-bold">
        Sedang memuat profil kamu...
      </div>
    );

  if (!user) return null;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main font-sans transition-colors duration-500 flex flex-col"
    >
      <Navbar />

      <div className="flex-1 pt-32 pb-20 max-w-5xl mx-auto px-4 w-full">
        {/* --- MAIN PROFILE CARD --- */}
        <div className="profile-card bg-bg-card border border-border-color rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-primary to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-8 gap-6">
              <div className="flex flex-col md:flex-row items-end gap-6 w-full">
                <div className="w-32 h-32 rounded-full bg-bg-card p-1.5 shadow-2xl relative z-10 shrink-0">
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-5xl border border-border-color overflow-hidden">
                    <span className="font-black text-primary">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div
                    className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-sm
                    ${
                      user.role === "admin"
                        ? "bg-yellow-400 text-yellow-900"
                        : "bg-primary text-white"
                    }
                  `}
                  >
                    {user.role}
                  </div>
                </div>

                <div className="mb-2 w-full">
                  {isEditing ? (
                    <form
                      onSubmit={handleUpdate}
                      className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full max-w-md animate-fade-in-up"
                    >
                      <input
                        className="flex-1 px-4 py-2 rounded-xl bg-bg-main border border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none text-xl font-bold"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-600 transition flex items-center gap-2"
                        >
                          <Save size={16} /> Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-bg-main text-text-muted border border-border-color px-4 py-2 rounded-xl font-bold text-sm hover:bg-border-color transition flex items-center gap-2"
                        >
                          <X size={16} /> Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <h1 className="text-3xl md:text-4xl font-black text-text-main flex items-center gap-3">
                        {user.name}
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-8 h-8 rounded-full bg-bg-main border border-border-color flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                          title="Edit Nama"
                        >
                          <Edit2 size={14} />
                        </button>
                      </h1>
                      <div className="flex items-center gap-2 text-text-muted font-medium mt-1">
                        <Mail size={16} /> {user.email}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-border-color w-full mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <User size={20} className="text-primary" /> Informasi Akun
                </h3>
                <div className="bg-bg-main rounded-2xl p-6 border border-border-color space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted flex items-center gap-2 text-sm">
                      <Calendar size={16} /> Bergabung Sejak
                    </span>
                    <span className="font-bold text-text-main">
                      {formatDate(user.date)}
                    </span>
                  </div>
                  <div className="h-px bg-border-color border-dashed"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted flex items-center gap-2 text-sm">
                      <Shield size={16} /> Status Akun
                    </span>
                    <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                      Aktif ✅
                    </span>
                  </div>
                </div>
              </div>

              {user.role === "student" && (
                <div className="stat-card">
                  <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-primary" />{" "}
                    Statistik Belajar
                  </h3>
                  <div className="bg-gradient-to-br from-primary/10 to-pink-500/10 rounded-2xl p-6 border border-primary/20 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BookOpen size={80} className="text-primary" />
                    </div>

                    <div className="relative z-10">
                      <div className="text-5xl font-black text-primary mb-1">
                        {user.enrolledCourses ? user.enrolledCourses.length : 0}
                      </div>
                      <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-6">
                        Kelas Diikuti
                      </p>

                      <button
                        onClick={() => navigate("/my-courses")}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        <BookOpen size={18} /> Lihat Kelas Saya
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
