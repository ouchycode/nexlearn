const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Comment = require("../models/Comment");
const User = require("../models/User");

// 1. KIRIM KOMENTAR
// POST /api/comments/:courseId
router.post("/:courseId", auth, async (req, res) => {
  try {
    const newComment = new Comment({
      text: req.body.text,
      course: req.params.courseId,
      user: req.user.id,
    });

    const savedComment = await newComment.save();

    // Kita perlu data user (nama) untuk ditampilkan di frontend
    // Jadi kita populate (gabungkan) data user ke komentar yang baru disimpan
    const fullComment = await Comment.findById(savedComment._id).populate(
      "user",
      "name"
    );

    res.json(fullComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. AMBIL SEMUA KOMENTAR DI SATU KURSUS
// GET /api/comments/:courseId
router.get("/:courseId", async (req, res) => {
  try {
    // Cari komentar berdasarkan courseId, urutkan dari yang terbaru
    // Populate 'user' agar kita dapat nama pengirimnya, bukan cuma ID
    const comments = await Comment.find({ course: req.params.courseId })
      .sort({ date: -1 })
      .populate("user", "name role"); // Ambil nama & role (biar tau kalo admin yg komen)

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 3. HAPUS KOMENTAR (Opsional: Hanya Admin atau Pemilik Komentar)
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ msg: "Komentar tidak ditemukan" });

    // Cek apakah yang hapus adalah pemilik komentar ATAU admin (logic sederhana dulu: pemilik saja)
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Tidak diizinkan" });
    }

    await comment.deleteOne();
    res.json({ msg: "Komentar dihapus" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
