const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --- REGISTER ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email sudah terdaftar" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: "student", // Default semua orang adalah student
    });

    await user.save();
    res.status(201).json({ msg: "Registrasi berhasil" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Password salah" });

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      "rahasia_negara_123",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        // PENTING: Kita kirim role ke frontend
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            role: user.role, // <--- INI KUNCINYA
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
