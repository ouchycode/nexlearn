import React, { useState, useEffect } from "react";
import API from "../api/axios"; // <--- Menggunakan instance API kita
import Swal from "sweetalert2";
// Icons
import { Send, Trash2, MessageCircle, User } from "lucide-react";

const CommentSection = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  // Fetch Komentar
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Cukup panggil rute ujungnya saja
        const res = await API.get(`/comments/${courseId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Gagal memuat komentar:", err);
      }
    };
    if (courseId) fetchComments();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      return Swal.fire({
        icon: "warning",
        title: "Login Dulu",
        text: "Silakan login untuk ikut berdiskusi.",
        confirmButtonColor: "#7c3aed",
      });
    }
    if (!text.trim()) return;

    try {
      // Header x-auth-token sudah otomatis ditangani oleh interceptor di api/axios.js
      const res = await API.post(`/comments/${courseId}`, { text });

      setComments([res.data, ...comments]);
      setText("");
    } catch (err) {
      Swal.fire("Error", "Gagal mengirim komentar", "error");
    }
  };

  const handleDelete = async (commentId) => {
    Swal.fire({
      title: "Hapus Komentar?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/comments/${commentId}`);
          setComments(comments.filter((c) => c._id !== commentId));
          Swal.fire("Terhapus!", "Komentar berhasil dihapus.", "success");
        } catch (err) {
          Swal.fire(
            "Gagal",
            "Anda tidak memiliki izin menghapus ini.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="mt-10 bg-bg-card border border-border-color p-6 md:p-8 rounded-3xl shadow-sm">
      <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
        Diskusi ({comments.length}){" "}
        <MessageCircle size={20} className="text-primary" />
      </h3>

      {/* Form Input */}
      {token ? (
        <form onSubmit={handleSubmit} className="mb-10 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User size={20} />
          </div>
          <div className="flex-1 relative">
            <textarea
              className="w-full bg-bg-main border border-border-color rounded-2xl p-4 pr-14 text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all placeholder-text-muted/50 min-h-[100px]"
              placeholder="Tulis pertanyaan atau diskusi..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
              disabled={!text.trim()}
              className="absolute bottom-3 right-3 bg-primary text-white p-2 rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-bg-main p-6 rounded-2xl text-center mb-10 border border-border-color border-dashed">
          <p className="text-text-muted">
            Ingin bertanya?{" "}
            <span className="font-bold text-primary">Login</span> dulu yuk untuk
            mulai diskusi.
          </p>
        </div>
      )}

      {/* List Komentar */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 group">
            {/* Avatar Inisial */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm uppercase
                ${
                  comment.user.role === "admin"
                    ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200"
                    : "bg-bg-main border border-border-color text-text-muted"
                }
            `}
            >
              {comment.user.name.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-text-main text-sm">
                  {comment.user.name}
                </span>

                {comment.user.role === "admin" && (
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-yellow-200">
                    Instruktur
                  </span>
                )}

                <span className="text-xs text-text-muted">
                  • {new Date(comment.date).toLocaleDateString()}
                </span>
              </div>

              <div className="bg-bg-main border border-border-color rounded-r-2xl rounded-bl-2xl p-3 text-sm text-text-muted leading-relaxed">
                {comment.text}
              </div>

              {/* Tombol Hapus */}
              {token && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-xs text-red-400 hover:text-red-600 mt-2 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-bg-main rounded-full mb-3 text-text-muted">
              <MessageCircle size={24} />
            </div>
            <p className="text-text-muted text-sm">
              Belum ada diskusi. Jadilah yang pertama berkomentar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
