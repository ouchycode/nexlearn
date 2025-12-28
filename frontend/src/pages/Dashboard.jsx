import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios"; // <--- Pastikan path ini benar (ke file axios.js Anda)
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Icons & Libs
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Video,
  LayoutDashboard,
  Layers,
  RefreshCw,
  Users,
  Mail,
  Calendar,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";

const Dashboard = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Form
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    image: "",
    price: 0,
    chapters: [{ title: "", videoUrl: "" }],
  });

  // 1. Cek Login & Fetch Data (Gunakan API Instance)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Proteksi: Hanya Admin yang boleh masuk dashboard
    if (!token || role !== "admin") {
      navigate("/");
    } else {
      fetchCourses();
      fetchUsers();
    }
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses"); // Relatif ke baseURL
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil kursus:", err);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Header x-auth-token sudah otomatis dikirim oleh API instance
      const res = await API.get("/users");
      setUsers(res.data);
      setLoadingUsers(false);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setLoadingUsers(false);
    }
  };

  // GSAP Animation
  useEffect(() => {
    if (!loading && courses.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".dashboard-card",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, courses]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleChapterChange = (index, e) => {
    const updatedChapters = [...newCourse.chapters];
    updatedChapters[index][e.target.name] = e.target.value;
    setNewCourse({ ...newCourse, chapters: updatedChapters });
  };

  const addChapter = () => {
    setNewCourse({
      ...newCourse,
      chapters: [...newCourse.chapters, { title: "", videoUrl: "" }],
    });
  };

  const removeChapter = (index) => {
    const updatedChapters = newCourse.chapters.filter((_, i) => i !== index);
    setNewCourse({ ...newCourse, chapters: updatedChapters });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/courses", newCourse);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kursus baru telah ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      setNewCourse({
        title: "",
        description: "",
        image: "",
        price: 0,
        chapters: [{ title: "", videoUrl: "" }],
      });
      fetchCourses();
    } catch (err) {
      const msg = err.response?.data?.msg || "Gagal menambah kursus";
      Swal.fire("Gagal", msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Kursus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/courses/${id}`);
          fetchCourses();
          Swal.fire("Terhapus!", "Kursus telah dihapus.", "success");
        } catch (err) {
          Swal.fire("Error", "Gagal menghapus", "error");
        }
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg-main text-text-main flex flex-col"
    >
      <Navbar />

      <div className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-border-color pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-3xl font-black">Dashboard Admin</h1>
            </div>
            <p className="text-text-muted">
              Kelola ekosistem belajar NexLearn.
            </p>
          </div>

          <button
            onClick={() => {
              fetchCourses();
              fetchUsers();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-color rounded-lg text-sm font-bold text-text-muted hover:text-primary transition-all"
          >
            <RefreshCw size={16} /> Sync Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- FORMULIR --- */}
          <div className="lg:col-span-1">
            <div className="bg-bg-card border border-border-color p-6 rounded-3xl shadow-lg sticky top-28 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-primary" /> Tambah Materi
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <input
                    className="w-full bg-bg-main border border-border-color p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold"
                    name="title"
                    placeholder="Judul Kursus"
                    value={newCourse.title}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    className="w-full bg-bg-main border border-border-color p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary h-24 text-sm resize-none"
                    name="description"
                    placeholder="Apa yang akan dipelajari?"
                    value={newCourse.description}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full bg-bg-main border border-border-color p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                    name="image"
                    placeholder="URL Cover Image"
                    value={newCourse.image}
                    onChange={handleChange}
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-bold text-text-muted">
                      Rp
                    </span>
                    <input
                      className="w-full bg-bg-main border border-border-color p-3 pl-8 rounded-xl outline-none focus:ring-2 focus:ring-primary font-mono"
                      name="price"
                      type="number"
                      value={newCourse.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border-color space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} /> Kurikulum Video
                  </label>

                  {newCourse.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="p-3 bg-bg-main border border-border-color rounded-xl relative group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-primary">
                          MODUL {index + 1}
                        </span>
                        {newCourse.chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChapter(index)}
                            className="text-red-500 hover:scale-110 transition-transform"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <input
                        className="w-full bg-transparent border-b border-border-color mb-2 text-sm pb-1 outline-none focus:border-primary"
                        placeholder="Nama Video"
                        name="title"
                        value={chapter.title}
                        onChange={(e) => handleChapterChange(index, e)}
                        required
                      />
                      <input
                        className="w-full bg-transparent text-[10px] outline-none text-primary font-mono"
                        placeholder="https://youtube.com/..."
                        name="videoUrl"
                        value={chapter.videoUrl}
                        onChange={(e) => handleChapterChange(index, e)}
                        required
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addChapter}
                    className="w-full py-2 border-2 border-dashed border-border-color rounded-xl text-xs font-bold text-text-muted hover:border-primary hover:text-primary transition-all"
                  >
                    + Modul Baru
                  </button>
                </div>

                <button
                  disabled={submitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Publish Kursus"}
                </button>
              </form>
            </div>
          </div>

          {/* --- KONTEN KANAN --- */}
          <div className="lg:col-span-2 space-y-12">
            {/* Daftar Kursus */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Materi Terbit</h2>
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {courses.length} Kursus
                </span>
              </div>

              {loading ? (
                <div className="text-center py-10 animate-pulse text-text-muted">
                  Fetching courses...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="dashboard-card bg-bg-card border border-border-color rounded-2xl overflow-hidden hover:shadow-glow transition-all group"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={
                            course.image || "https://via.placeholder.com/300"
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          alt=""
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Link
                            to={`/edit-course/${course._id}`}
                            className="p-2 bg-white/90 text-yellow-600 rounded-full shadow-md hover:scale-110 transition-transform"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="p-2 bg-white/90 text-red-500 rounded-full shadow-md hover:scale-110 transition-transform"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-bold">
                          Rp {course.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Daftar User */}
            <section className="dashboard-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users size={22} className="text-primary" /> Pengguna
                  Terdaftar
                </h2>
                <span className="text-xs font-bold bg-green-500/10 text-green-500 px-3 py-1 rounded-full">
                  {users.length} Total
                </span>
              </div>

              <div className="bg-bg-card border border-border-color rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-bg-main border-b border-border-color">
                        <th className="p-4 text-[10px] font-black text-text-muted uppercase">
                          Profil
                        </th>
                        <th className="p-4 text-[10px] font-black text-text-muted uppercase">
                          Email
                        </th>
                        <th className="p-4 text-[10px] font-black text-text-muted uppercase text-center">
                          Join Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {loadingUsers ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="p-10 text-center text-text-muted italic"
                          >
                            Syncing user database...
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr
                            key={user._id}
                            className="hover:bg-primary/5 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                                  {user.name?.charAt(0)}
                                </div>
                                <span className="font-bold text-sm">
                                  {user.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-text-muted font-medium">
                              <Mail
                                size={12}
                                className="inline mr-2 opacity-50"
                              />
                              {user.email}
                            </td>
                            <td className="p-4 text-xs text-text-muted text-center font-mono">
                              {new Date(
                                user.createdAt || user.date
                              ).toLocaleDateString("id-ID")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
