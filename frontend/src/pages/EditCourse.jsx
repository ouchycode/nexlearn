import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API kita
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Icons & Libs
import { ArrowLeft, Save, Trash2, Plus, Layers, Video } from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    image: "",
    price: 0,
    chapters: [],
  });

  // 1. Fetch Old Data menggunakan API Instance
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Cukup panggil rute ujungnya, baseUrl & token sudah dihandle di axios.js
        const res = await API.get(`/courses/${id}`);
        setCourse(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        Swal.fire("Error", "Gagal memuat data kursus", "error");
        navigate("/dashboard");
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // GSAP Animation
  useEffect(() => {
    if (!loading) {
      let ctx = gsap.context(() => {
        gsap.from(".edit-anim", {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  // Handle Input Biasa
  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  // --- LOGIKA CHAPTERS ---
  const handleChapterChange = (index, e) => {
    const updatedChapters = [...course.chapters];
    updatedChapters[index][e.target.name] = e.target.value;
    setCourse({ ...course, chapters: updatedChapters });
  };

  const addChapter = () => {
    setCourse({
      ...course,
      chapters: [...course.chapters, { title: "", videoUrl: "" }],
    });
  };

  const removeChapter = (index) => {
    const updatedChapters = course.chapters.filter((_, i) => i !== index);
    setCourse({ ...course, chapters: updatedChapters });
  };

  // Handle Submit menggunakan API instance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Menggunakan API.put (URL baseUrl & token otomatis dihandle)
      await API.put(`/courses/${id}`, course);

      Swal.fire({
        icon: "success",
        title: "Berhasil Diupdate!",
        text: "Perubahan telah disimpan.",
        timer: 1500,
        showConfirmButton: false,
        background: "#fff",
        color: "#1f2937",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat update", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-text-muted font-bold">
        Menyiapkan data kursus...
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main font-sans transition-colors duration-500 flex flex-col"
    >
      <Navbar />

      <div className="flex-1 pt-32 pb-20 max-w-4xl mx-auto px-4 w-full">
        <div className="bg-bg-card border border-border-color p-8 rounded-3xl shadow-lg edit-anim">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-border-color pb-6">
            <div>
              <h1 className="text-2xl font-black text-text-main mb-1">
                Edit Kursus ✏️
              </h1>
              <p className="text-text-muted text-sm">
                Perbarui konten materi pembelajaran.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-text-muted hover:text-primary font-bold transition-colors bg-bg-main border border-border-color px-4 py-2 rounded-xl text-sm"
            >
              <ArrowLeft size={16} /> Batal
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* DATA UMUM */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">
                  Judul Kursus
                </label>
                <input
                  className="w-full bg-bg-main border border-border-color p-3 rounded-xl text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  className="w-full bg-bg-main border border-border-color p-3 rounded-xl text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none text-sm leading-relaxed"
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">
                    URL Gambar Cover
                  </label>
                  <input
                    className="w-full bg-bg-main border border-border-color p-3 rounded-xl text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                    name="image"
                    value={course.image}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-muted mb-2 uppercase tracking-wider">
                    Harga (Rp)
                  </label>
                  <input
                    className="w-full bg-bg-main border border-border-color p-3 rounded-xl text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-mono"
                    name="price"
                    type="number"
                    value={course.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* PLAYLIST / CHAPTERS */}
            <div className="border-t border-border-color pt-8 mt-8">
              <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                <Layers size={20} className="text-primary" /> Edit Playlist
                Video
              </h3>

              <div className="space-y-4">
                {course.chapters &&
                  course.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="p-5 bg-bg-main border border-border-color rounded-2xl relative group hover:border-primary/30 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20">
                          Episode {index + 1}
                        </span>
                        {course.chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChapter(index)}
                            className="text-text-muted hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 size={16} /> Hapus
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className="w-full bg-bg-card border border-border-color p-3 rounded-xl text-sm text-text-main focus:ring-1 focus:ring-primary outline-none"
                          name="title"
                          placeholder="Judul Video"
                          value={chapter.title}
                          onChange={(e) => handleChapterChange(index, e)}
                          required
                        />
                        <div className="relative">
                          <Video
                            size={16}
                            className="absolute left-3 top-3.5 text-text-muted"
                          />
                          <input
                            className="w-full bg-bg-card border border-border-color p-3 pl-10 rounded-xl text-sm text-text-main focus:ring-1 focus:ring-primary outline-none font-mono text-xs"
                            name="videoUrl"
                            placeholder="Link Youtube"
                            value={chapter.videoUrl}
                            onChange={(e) => handleChapterChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                type="button"
                onClick={addChapter}
                className="mt-6 w-full border-2 border-dashed border-border-color text-text-muted py-4 rounded-2xl font-bold hover:bg-bg-main hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Tambah Episode Baru
              </button>
            </div>

            {/* TOMBOL SIMPAN */}
            <div className="border-t border-border-color pt-6">
              <button
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover shadow-lg shadow-primary/30 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save size={20} /> Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditCourse;
