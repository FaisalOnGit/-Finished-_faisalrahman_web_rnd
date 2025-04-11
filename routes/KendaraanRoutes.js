const express = require("express");
const router = express.Router();
const Kendaraan = require("../models/Kendaraan");

// 📌 GET Semua Kendaraan
router.get("/", async (req, res) => {
  try {
    const kendaraanList = await Kendaraan.find();
    res.json(kendaraanList);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data kendaraan", error });
  }
});

// 📌 GET Kendaraan berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const kendaraan = await Kendaraan.findOne({ KendaraanID: req.params.id });
    if (!kendaraan)
      return res.status(404).json({ message: "Kendaraan tidak ditemukan" });
    res.json(kendaraan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data kendaraan", error });
  }
});

// 📌 POST Tambah Kendaraan
router.post("/", async (req, res) => {
  try {
    const { PlatNomor, Jenis, Tipe } = req.body;

    // Validasi apakah PlatNomor sudah ada
    const existingKendaraan = await Kendaraan.findOne({ PlatNomor });
    if (existingKendaraan) {
      return res.status(400).json({ message: "Plat nomor sudah terdaftar" });
    }

    const kendaraanBaru = new Kendaraan({ PlatNomor, Jenis, Tipe });
    await kendaraanBaru.save();
    res.status(201).json({
      message: "Kendaraan berhasil ditambahkan",
      kendaraan: kendaraanBaru,
    });
  } catch (error) {
    res.status(400).json({ message: "Gagal menambahkan kendaraan", error });
  }
});

// 📌 PUT Update Kendaraan
router.put("/:id", async (req, res) => {
  try {
    const { PlatNomor, Jenis, Tipe } = req.body;
    const kendaraan = await Kendaraan.findOneAndUpdate(
      { KendaraanID: req.params.id },
      { PlatNomor, Jenis, Tipe },
      { new: true, runValidators: true }
    );

    if (!kendaraan)
      return res.status(404).json({ message: "Kendaraan tidak ditemukan" });

    res.json({ message: "Kendaraan berhasil diperbarui", kendaraan });
  } catch (error) {
    res.status(400).json({ message: "Gagal memperbarui kendaraan", error });
  }
});

// 📌 DELETE Hapus Kendaraan
router.delete("/:id", async (req, res) => {
  try {
    const kendaraan = await Kendaraan.findOneAndDelete({
      KendaraanID: req.params.id,
    });
    if (!kendaraan)
      return res.status(404).json({ message: "Kendaraan tidak ditemukan" });

    res.json({ message: "Kendaraan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kendaraan", error });
  }
});

module.exports = router;
