const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Course = require("../models/Course");

// 1. GABUNG KELAS (ENROLL)
// Method: POST /api/users/enroll/:courseId
router.post("/enroll/:courseId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const courseId = req.params.courseId;

    // Cek apakah kursus valid
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Kursus tidak ditemukan" });

    // Cek apakah sudah pernah gabung?
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ msg: "Anda sudah mengikuti kursus ini" });
    }

    // Masukkan ID kursus ke array user
    user.enrolledCourses.push(courseId);
    await user.save();

    res.json({
      msg: "Berhasil bergabung ke kelas!",
      enrolledCourses: user.enrolledCourses,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. LIHAT KELAS SAYA (MY COURSES)
// Method: GET /api/users/my-courses
router.get("/my-courses", auth, async (req, res) => {
  try {
    // Cari user, lalu POPULATE (ambil data lengkap) dari enrolledCourses
    const user = await User.findById(req.user.id).populate("enrolledCourses");

    // Kirim daftar kursusnya saja
    res.json(user.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 3. CEK STATUS ENROLL (Apakah user ini sudah ambil kursus X?)
router.get("/check-enroll/:courseId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.includes(req.params.courseId);
    res.json({ isEnrolled });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.put("/profile", auth, async (req, res) => {
  try {
    const { name } = req.body;

    // Cari user
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Update nama
    user.name = name || user.name;

    await user.save();

    res.json({ msg: "Profil berhasil diperbarui", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 5. AMBIL DATA USER (LENGKAP)
// Method: GET /api/users/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Jangan kirim password
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 6. AMBIL SEMUA USER (ADMIN ONLY)
// Method: GET /api/users
router.get("/", auth, async (req, res) => {
  try {
    // 1. Cek apakah user yang request adalah admin
    // Asumsi: Di model User Anda punya field "role" (admin/user)
    const currentUser = await User.findById(req.user.id);

    if (currentUser.role !== "admin") {
      return res.status(403).json({ msg: "Akses ditolak: Anda bukan admin" });
    }

    // 2. Ambil semua user, urutkan dari yang terbaru (descending)
    // Select("-password") agar data password tidak bocor ke frontend
    const allUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(allUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
