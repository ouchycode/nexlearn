const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Konfigurasi Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Ambil dari .env
        pass: process.env.EMAIL_PASS, // Ambil dari .env (App Password)
      },
    });

    // 2. Isi Email yang akan Anda terima
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Email Anda sendiri
      subject: `[NexLearn Contact] Pesan Baru dari ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #7c3aed;">Pesan Baru dari Website</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email Pengirim:</strong> ${email}</p>
          <hr />
          <p><strong>Isi Pesan:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 10px;">${message}</p>
        </div>
      `,
    };

    // 3. Eksekusi Pengiriman
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, msg: "Pesan berhasil dikirim ke email!" });
  } catch (error) {
    console.error("Error Nodemailer:", error);
    res.status(500).json({ success: false, msg: "Gagal mengirim pesan." });
  }
});

module.exports = router;
