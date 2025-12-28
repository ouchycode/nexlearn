import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import API from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Icons & Libs
import { Search, Play, BookOpen, FilterX } from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("search");

  const containerRef = useRef(null);

  // 1. Fetch Data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
        setFilteredCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat materi:", err);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    if (keyword) {
      const results = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(keyword.toLowerCase()) ||
          course.description.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredCourses(results);
    } else {
      setFilteredCourses(courses);
    }
  }, [keyword, courses]);

  // 3. GSAP ANIMATION (FIXED)
  useLayoutEffect(() => {
    if (!loading) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // A. Header
        tl.from(".header-anim", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });

        // B. Search Bar
        tl.from(
          ".search-anim",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        );

        // C. Cards (HANYA GUNAKAN .from AGAR TIDAK KONFLIK)
        if (filteredCourses.length > 0) {
          gsap.from(".course-card", {
            y: 50,
            opacity: 0, // GSAP yang bikin transparan di awal, bukan CSS class
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
            clearProps: "transform", // Hanya hapus transform, biarkan opacity tetap 1
          });
        } else {
          gsap.from(".not-found-anim", {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          });
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, filteredCourses]);

  const handleCourseClick = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/course/${id}`);
    } else {
      Swal.fire({
        icon: "info",
        title: "Eits, Login Dulu!",
        text: "Akses materi khusus untuk member terdaftar.",
        confirmButtonText: "Oke, Siap!",
        confirmButtonColor: "#7c3aed",
        background: "#fff",
        color: "#1f2937",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main font-sans transition-colors duration-500"
    >
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16 header-anim">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-3xl mb-6 shadow-lg shadow-primary/20">
            <BookOpen size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Eksplorasi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              Skill Baru
            </span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Temukan tutorial yang pas buat kamu. Dari desain, bisnis, sampai
            coding, semuanya ada di sini.
          </p>
        </div>

        {/* --- SEARCH & INFO --- */}
        <div className="search-anim mb-10 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border-color pb-6 gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {keyword ? (
              <>
                <Search size={24} className="text-primary" />
                <span>
                  Hasil: <span className="text-primary">"{keyword}"</span>
                </span>
              </>
            ) : (
              "Semua Materi"
            )}
          </h2>
          <span className="text-sm font-bold text-text-muted bg-bg-card px-4 py-2 rounded-full border border-border-color shadow-sm">
            {filteredCourses.length} Kursus Tersedia
          </span>
        </div>

        {/* --- GRID KURSUS --- */}
        {loading ? (
          <div className="text-center py-32 text-text-muted animate-pulse font-bold text-lg">
            Sedang menyiapkan materi terbaik buat kamu...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                  // PERBAIKAN DI SINI: HAPUS "opacity-0"
                  className="course-card group bg-bg-card border border-border-color rounded-[2rem] overflow-hidden hover:border-primary/50 hover:shadow-glow transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-2"
                >
                  {/* Image Area */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={course.image || "https://via.placeholder.com/300"}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
                      alt={course.title}
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md shadow-lg border ${
                          course.price === 0
                            ? "bg-green-500 text-white border-green-400"
                            : "bg-white/90 text-text-main border-white"
                        }`}
                      >
                        {course.price === 0
                          ? "GRATIS"
                          : `Rp ${course.price.toLocaleString()}`}
                      </span>
                    </div>
                    {/* Overlay Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 hover:scale-110">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-7 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Video Course
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-text-main mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-text-muted text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="pt-5 border-t border-border-color flex items-center justify-between text-text-muted text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <Play size={14} /> {course.chapters?.length || 0} Video
                      </div>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-primary">
                        Akses Sekarang &rarr;
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Not Found State */
              <div className="not-found-anim col-span-full text-center py-24 bg-bg-card rounded-[3rem] border border-dashed border-border-color">
                <div className="w-24 h-24 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted shadow-sm">
                  <FilterX size={48} />
                </div>
                <h3 className="text-2xl font-black text-text-main mb-3">
                  Yah, materi tidak ditemukan...
                </h3>
                <p className="text-text-muted mb-8 text-lg">
                  Coba cari dengan kata kunci lain.
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="bg-primary text-white px-8 py-3.5 rounded-full font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:scale-105"
                >
                  Lihat Semua Materi
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
