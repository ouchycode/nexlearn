const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  // --- TAMBAHAN BARU: DAFTAR KELAS SAYA ---
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course", // Relasi ke tabel Course
    },
  ],
  // ----------------------------------------
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
