const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Course = require("../models/Course");

// 1. TAMBAH KURSUS
router.post("/", auth, async (req, res) => {
  try {
    // Ambil 'chapters' dari body, bukan videoUrl lagi
    const { title, description, image, price, chapters } = req.body;

    const newCourse = new Course({
      title,
      description,
      image,
      price,
      chapters, // <--- Simpan array chapters
      user: req.user.id,
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. AMBIL SEMUA
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 3. AMBIL SATU
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Kursus tidak ditemukan" });
    res.json(course);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Kursus tidak ditemukan" });
    res.status(500).send("Server Error");
  }
});

// 4. HAPUS
router.delete("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Kursus tidak ditemukan" });
    if (course.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User tidak diizinkan" });

    await course.deleteOne();
    res.json({ msg: "Kursus berhasil dihapus" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 5. UPDATE (EDIT)
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, image, price, chapters } = req.body;

    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Kursus tidak ditemukan" });
    if (course.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Tidak diizinkan" });

    course.title = title || course.title;
    course.description = description || course.description;
    course.image = image || course.image;
    course.price = price !== undefined ? price : course.price;

    // Update chapters jika ada data baru
    if (chapters) {
      course.chapters = chapters;
    }

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
