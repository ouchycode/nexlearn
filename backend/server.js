const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Berhasil connect ke MongoDB Atlas (NexLearn)"))
  .catch((err) => console.error("Gagal connect:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/users", require("./routes/users"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/contact", require("./routes/contact"));

app.get("/", (req, res) => {
  res.send("Server Backend NexLearn Berjalan!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
