import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API kita
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Icons & Libs
import { BookOpen, Play, CheckCircle, SearchX, ArrowRight } from "lucide-react";
import gsap from "gsap";

const MyCourses = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data menggunakan API Instance
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Cukup panggil rute ujungnya, baseURL dan Header Token otomatis dihandle di axios.js
        const res = await API.get("/users/my-courses");

        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat kursus saya:", err);
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [navigate]);

  // 2. GSAP Animation
  useEffect(() => {
    if (!loading && courses.length > 0) {
      let ctx = gsap.context(() => {
        gsap.from(".my-course-card", {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, courses]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main font-sans transition-colors duration-500 flex flex-col"
    >
      <Navbar />

      <div className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 border-b border-border-color pb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text-main mb-2">
              Kelas <span className="text-primary">Saya</span>
            </h1>
            <p className="text-text-muted text-lg">
              Lanjutkan progres belajar kamu. Jangan kasih kendor! 🔥
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20 font-bold text-text-muted animate-pulse">
            Sedang memuat data kelas kamu...
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="my-course-card group bg-bg-card rounded-3xl border border-border-color overflow-hidden hover:shadow-glow hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.image || "https://via.placeholder.com/300"}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    alt={course.title}
                  />
                  <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                    <CheckCircle size={10} /> AKTIF
                  </div>
                  {/* Overlay Play */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
                    <Link
                      to={`/course/${course._id}`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-text-main mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                    <Play size={12} />
                    <span>{course.chapters?.length || 0} Materi Video</span>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/course/${course._id}`}
                      className="block w-full text-center bg-primary/10 text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                      Lanjut Belajar ▶
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-bg-card rounded-3xl border border-dashed border-border-color flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center text-text-muted mb-6 shadow-sm">
              <SearchX size={40} />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-2">
              Belum ada kelas yang diambil
            </h3>
            <p className="text-text-muted mb-8 max-w-md">
              Wah, dashboard kamu masih kosong nih. Yuk cari materi baru buat
              upgrade skill kamu hari ini!
            </p>
            <Link
              to="/courses"
              className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition shadow-lg shadow-primary/30 flex items-center gap-2 group"
            >
              Cari Kursus{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyCourses;
