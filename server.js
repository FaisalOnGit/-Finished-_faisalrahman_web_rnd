const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const gerbangRoutes = require("./routes/GerbangRoutes");
const petugasRoutes = require("./routes/PetugasRoutes");
const kendaraanRoutes = require("./routes/KendaraanRoutes");
const transaksiRoutes = require("./routes/TransaksiRoutes");

app.use("/gerbang", gerbangRoutes);
app.use("/petugas", petugasRoutes);
app.use("/kendaraan", kendaraanRoutes);
app.use("/transaksi", transaksiRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => console.error("🔴 MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
