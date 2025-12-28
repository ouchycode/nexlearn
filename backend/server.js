const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");
const contactRoutes = require("./routes/contact");

const app = express();

// --- 1. SETUP CORS ---
// Penting: Izinkan akses dari Frontend Vercel Anda dan Localhost
app.use(
  cors({
    origin: ["http://localhost:5173", "https://nexlearn-mauve.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// --- 2. KONEKSI DATABASE ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Berhasil connect ke MongoDB Atlas (NexLearn)"))
  .catch((err) => console.error("Gagal connect:", err));

// --- 3. ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/contact", contactRoutes);

// --- 4. CHECK ROUTE ---
app.get("/", (req, res) => {
  res.send("Server Backend NexLearn Berjalan!");
});

// --- 5. KONFIGURASI SERVERLESS (WAJIB UNTUK VERCEL) ---
// Hanya jalankan app.listen saat di local (bukan production)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export app agar Vercel bisa membacanya sebagai Serverless Function
module.exports = app;
