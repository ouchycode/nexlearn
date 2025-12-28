const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Ambil token dari header
  const token = req.header("x-auth-token");

  // 2. Cek kalau tidak ada token
  if (!token) {
    return res.status(401).json({ msg: "Tidak ada token, akses ditolak" });
  }

  // 3. Verifikasi token
  try {
    const decoded = jwt.verify(token, "rahasia_negara_123"); // Harus sama dengan yang di auth.js
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token tidak valid" });
  }
};
