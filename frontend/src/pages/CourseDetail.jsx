import React, { useState, useEffect } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API
import { useParams, Link, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Libs
import Swal from "sweetalert2";
import { Play, CheckCircle, ArrowLeft, Lock } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DATA KURSUS & STATUS ENROLL
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // A. Ambil Detail Kursus (URL disingkat karena baseUrl sudah ada di API instance)
        const courseRes = await API.get(`/courses/${id}`);
        setCourse(courseRes.data);

        // B. Set Default Video (Chapter Pertama)
        if (courseRes.data.chapters && courseRes.data.chapters.length > 0) {
          setActiveChapter(courseRes.data.chapters[0]);
        }

        // C. Cek Status Enroll (Jika Login)
        const token = localStorage.getItem("token");
        if (token) {
          // Token otomatis dikirim lewat interceptor di api/axios.js
          const enrollRes = await API.get(`/users/check-enroll/${id}`);
          setIsEnrolled(enrollRes.data.isEnrolled);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        Swal.fire("Error", "Gagal memuat data kursus", "error");
      }
    };

    fetchData();
  }, [id]);

  // Handle Enroll
  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire({
        icon: "warning",
        title: "Login Dulu Yuk!",
        text: "Kamu harus masuk akun untuk gabung kelas ini.",
        confirmButtonText: "Ke Halaman Login",
        confirmButtonColor: "#7c3aed",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    }

    try {
      // Mengirim request enroll via API Instance
      await API.post(`/users/enroll/${id}`, {});

      setIsEnrolled(true);

      Swal.fire({
        icon: "success",
        title: "Berhasil Gabung! 🎉",
        text: 'Selamat belajar! Materi ini sekarang ada di menu "Kelas Saya".',
        confirmButtonColor: "#7c3aed",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.msg || "Terjadi kesalahan sistem",
      });
    }
  };

  // Helper Youtube Embed
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-text-muted">
        Loading Materi...
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-text-muted">
        Data Kursus Tidak Ditemukan.
      </div>
    );

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans transition-colors duration-500 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 pt-32 pb-10">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group border border-border-color">
              {activeChapter ? (
                <iframe
                  className="w-full h-full min-h-[300px] md:min-h-[500px]"
                  src={getYoutubeEmbedUrl(activeChapter.videoUrl)}
                  title={activeChapter.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 bg-gray-900">
                  <Play size={48} className="mb-4 opacity-50" />
                  <p>Pilih episode di sebelah kanan untuk mulai menonton.</p>
                </div>
              )}
            </div>

            <div className="bg-bg-card border border-border-color p-6 md:p-8 rounded-3xl shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border-color pb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-text-main mb-2">
                    {activeChapter ? activeChapter.title : course.title}
                  </h1>
                  <p className="text-text-muted text-sm">
                    Course:{" "}
                    <span className="font-bold text-primary">
                      {course.title}
                    </span>
                  </p>
                </div>
                {isEnrolled && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-bold text-sm border border-green-500/20">
                    <CheckCircle size={16} /> Terdaftar
                  </span>
                )}
              </div>

              <div className="prose prose-purple max-w-none text-text-muted">
                <h3 className="text-lg font-bold text-text-main mb-2">
                  Deskripsi Materi
                </h3>
                <p className="whitespace-pre-line leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <CommentSection courseId={id} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-bg-card border border-border-color rounded-3xl shadow-lg overflow-hidden sticky top-28">
              <div className="bg-primary p-6 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Play size={20} fill="currentColor" /> Materi Kursus
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Total {course.chapters?.length || 0} Episode Video
                </p>
              </div>

              <div className="p-5 border-b border-border-color bg-bg-main">
                {isEnrolled ? (
                  <div className="w-full bg-green-500/10 text-green-600 py-3 rounded-xl font-bold text-center border border-green-500/20 text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Kamu sudah punya akses
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-hover transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <Lock size={18} /> Gabung Kelas Ini (Gratis)
                  </button>
                )}
              </div>

              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                {course.chapters && course.chapters.length > 0 ? (
                  course.chapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveChapter(chapter)}
                      className={`w-full text-left p-4 border-b border-border-color hover:bg-primary/5 transition flex gap-4 items-start group
                        ${
                          activeChapter === chapter
                            ? "bg-primary/10 border-l-4 border-l-primary"
                            : "border-l-4 border-l-transparent"
                        }
                      `}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-1 transition-colors
                         ${
                           activeChapter === chapter
                             ? "bg-primary text-white"
                             : "bg-bg-main text-text-muted border border-border-color"
                         }
                      `}
                      >
                        {activeChapter === chapter ? (
                          <Play size={12} fill="currentColor" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`text-sm font-bold leading-snug mb-1 ${
                            activeChapter === chapter
                              ? "text-primary"
                              : "text-text-main group-hover:text-primary"
                          }`}
                        >
                          {chapter.title}
                        </h4>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide">
                          Video Pembelajaran
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-muted">
                    <p className="text-sm">Belum ada materi yang diupload.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
