const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/300",
  },
  price: {
    type: Number,
    default: 0,
  },

  chapters: [
    {
      title: { type: String, required: true }, // Judul Video (misal: "Eps 1: Intro")
      videoUrl: { type: String, required: true }, // Link Youtube
    },
  ],
  // ------------------------------

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("course", CourseSchema);
