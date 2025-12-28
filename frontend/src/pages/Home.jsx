import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// SweetAlert2
import Swal from "sweetalert2";
// Icons
import {
  ArrowRight,
  Play,
  Rocket,
  Globe,
  Zap,
  Star,
  Quote,
} from "lucide-react";

// GSAP
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin GSAP
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs untuk target animasi GSAP
  const containerRef = useRef(null);

  // DATA TESTIMONI STATIS
  const testimonials = [
    {
      id: 1,
      name: "Muhammad Fadli Husna Mubarok",
      role: "Frontend Dev",
      content:
        "Gila sih, UI-nya clean parah! Bikin betah belajar lama-lama. Navigasinya juga sat-set, gak bikin bingung user baru. Top tier experience! 🔥",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky",
    },
    {
      id: 2,
      name: "Siti Aisyah",
      role: "Mahasiswi IT",
      content:
        "Definisi 'materi daging' dengan platform yang smooth. Loadingnya cepet, fitur-fiturnya helpful banget. Belajar coding jadi gak kerasa berat.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    },
    {
      id: 3,
      name: "Muhammad Luthfi Nabhan",
      role: "Freelancer",
      content:
        "Platform belajar lokal rasa internasional. Tampilannya modern, akses materinya gampang, dan yang paling penting: mobile friendly banget!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    },
  ];

  // 1. Fetch Data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. GSAP: ANIMASI STATIS (Hero, Stats, Bento, Testimoni)
  useEffect(() => {
    let ctx = gsap.context(() => {
      // A. HERO ANIMATION
      const tl = gsap.timeline();
      tl.from(".hero-badge", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          ".hero-title",
          { y: 50, opacity: 0, duration: 1, ease: "power4.out", skewY: 2 },
          "-=0.6"
        )
        .from(
          ".hero-desc",
          { y: 30, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.8"
        )
        .from(
          ".hero-btn",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        )
        .from(
          ".hero-img",
          { x: 50, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.8"
        );

      // B. SCROLL TRIGGERS (Stats & Bento)
      gsap.from(".stat-item", {
        scrollTrigger: { trigger: ".stats-section", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      });

      gsap.from(".bento-card", {
        scrollTrigger: { trigger: ".bento-section", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });

      // C. TESTIMONI ANIMATION (Sekarang di bawah)
      // Kita set start agak bawah karena posisinya paling akhir
      gsap.from(".testi-card", {
        scrollTrigger: { trigger: ".testi-section", start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.2)",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3. GSAP: ANIMASI DINAMIS (Kursus)
  // Penting: ScrollTrigger.refresh() dipanggil di sini agar posisi Testimoni
  // dikalkulasi ulang setelah Kursus dimuat (supaya tidak numpuk/bug).
  useEffect(() => {
    if (!loading && courses.length > 0) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
        let ctx = gsap.context(() => {
          gsap.fromTo(
            ".course-card",
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: ".courses-section",
                start: "top 85%",
              },
            }
          );
        }, containerRef);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, courses]);

  // --- HANDLER KLIK ---
  const handleCourseClick = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/course/${id}`);
    } else {
      Swal.fire({
        title: "🔒 Login Dulu Yuk!",
        text: "Kamu harus masuk akun dulu untuk melihat isi materi tutorial ini.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Gaskeun Login",
        cancelButtonText: "Nanti Dulu",
        background: "#fff",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main font-sans overflow-x-hidden transition-colors duration-500"
    >
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-50">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-wide mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            TEMPAT BELAJAR PALING NYANTAI ☕
          </div>

          <h1 className="hero-title text-5xl md:text-8xl font-black tracking-tight mb-8 leading-tight text-text-main">
            Cari Tutorial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
              Gak Pake Ribet.
            </span>
          </h1>

          <p className="hero-desc text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Bingung mau mulai belajar dari mana? Di sini materinya lengkap,
            bahasa Indonesia, dan gampang dimengerti. Mulai dari nol pun bisa!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="hero-btn group relative px-8 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-all overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                Mulai Belajar Yuk <ArrowRight size={20} />
              </span>
            </Link>

            <Link
              to="/about"
              className="hero-btn px-8 py-4 rounded-full font-bold text-text-muted border border-border-color hover:text-text-main hover:bg-bg-card transition-all flex items-center gap-2 bg-bg-card/50 backdrop-blur-sm"
            >
              <Play size={20} className="text-text-muted" /> Liat Demonya
            </Link>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="border-y border-border-color bg-bg-card/50 py-10 mb-20 stats-section">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6">
            Cocok buat kamu yang mau jadi
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="stat-item flex items-center gap-2 font-bold text-xl text-text-main">
              <Zap /> Kreator Digital
            </div>
            <div className="stat-item flex items-center gap-2 font-bold text-xl text-text-main">
              <Globe /> Freelancer
            </div>
            <div className="stat-item flex items-center gap-2 font-bold text-xl text-text-main">
              <Rocket /> Entrepreneur
            </div>
            <div className="stat-item flex items-center gap-2 font-bold text-xl text-text-main">
              <Star /> Expert
            </div>
          </div>
        </div>
      </div>

      {/* --- BENTO SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mb-32 bento-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Kenapa Belajar di Sini? 🤔
          </h2>
          <p className="text-text-muted text-lg">
            Biar gak pusing cari tutorial sana-sini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-card md:col-span-2 bg-bg-card border border-border-color rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors duration-500 hover:shadow-glow">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
              <Rocket size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Rocket size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-text-main">
                Tutorial Pilihan
              </h3>
              <p className="text-text-muted max-w-md leading-relaxed">
                Kami kumpulkan tutorial terbaik yang gampang diikuti, disusun
                rapi agar kamu belajar secara terstruktur!
              </p>
            </div>
          </div>

          <div className="bento-card bg-bg-card border border-border-color rounded-3xl p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">
              Akses Selamanya
            </h3>
            <p className="text-text-muted text-sm">
              Sekali gabung, materinya jadi milikmu selamanya.
            </p>
          </div>

          <div className="bento-card bg-bg-card border border-border-color rounded-3xl p-8 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">
              Hemat Waktu
            </h3>
            <p className="text-text-muted text-sm">
              Kami pilihkan video tutorial yang paling to-the-point khusus buat
              kamu.
            </p>
          </div>

          <div className="bento-card md:col-span-2 bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 flex items-center justify-between group text-white shadow-lg">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Siap Kuasai Skill Baru?
              </h3>
              <p className="text-white/80">
                Mulai belajar sekarang lewat tutorial pilihan yang sudah kami
                siapkan.
              </p>
            </div>
            <Link
              to="/courses"
              className="bg-white text-primary w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
            >
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* --- COURSES SECTION (DIGESER KE ATAS) --- */}
      <div className="max-w-7xl mx-auto px-4 pb-20 courses-section">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-text-main">
              Materi Terbaru 🔥
            </h2>
            <p className="text-text-muted">
              Yang lagi anget-angetnya nih, sikat!
            </p>
          </div>
          <Link
            to="/courses"
            className="hidden md:flex text-primary hover:text-primary-hover font-bold items-center gap-2 transition-colors"
          >
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-muted animate-pulse">
            Lagi loading bentar...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[300px]">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                  className="course-card group bg-bg-card border border-border-color rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-glow transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-2 opacity-0"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.image || "https://via.placeholder.com/300"}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-90 group-hover:opacity-100"
                      alt={course.title}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${
                          course.price === 0
                            ? "bg-green-500 text-white"
                            : "bg-bg-main/80 text-text-main border border-border-color"
                        }`}
                      >
                        {course.price === 0
                          ? "GRATIS"
                          : `Rp ${course.price.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-text-main mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-text-muted text-xs line-clamp-2 mb-4 flex-1">
                      {course.description}
                    </p>
                    <div className="pt-3 border-t border-border-color flex items-center gap-4 text-text-muted text-xs">
                      <div className="flex items-center gap-1">
                        <Play size={12} /> {course.chapters?.length || 0} Video
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-text-muted">
                Belum ada kursus yang tersedia.
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- TESTIMONI SECTION (PINDAH KE BAWAH) --- */}
      <div className="max-w-7xl mx-auto px-4 pb-32 testi-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Kata Mereka 👋
          </h2>
          <p className="text-text-muted text-lg">
            Apa kata alumni yang udah menggunakan NexLearn?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="testi-card bg-bg-card border border-border-color p-8 rounded-3xl relative hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg"
            >
              <Quote
                size={40}
                className="text-primary/10 absolute top-6 right-6"
              />
              <p className="text-text-main text-lg mb-6 leading-relaxed">
                "{testi.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={testi.avatar}
                    alt={testi.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-text-main">{testi.name}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">
                    {testi.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
