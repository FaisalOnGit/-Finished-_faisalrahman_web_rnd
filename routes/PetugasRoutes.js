const express = require("express");
const router = express.Router();
const Petugas = require("../models/Petugas");

// 📌 GET - Ambil semua petugas
router.get("/", async (req, res) => {
  try {
    const petugasList = await Petugas.find();
    res.json(petugasList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 GET - Ambil petugas berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const petugas = await Petugas.findOne({ PetugasID: req.params.id });
    if (!petugas)
      return res.status(404).json({ message: "Petugas tidak ditemukan" });
    res.json(petugas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 POST - Tambah petugas baru
router.post("/", async (req, res) => {
  try {
    const { NamaPetugas, Shift } = req.body;

    // Validasi shift
    if (!["Pagi", "Siang", "Malam"].includes(Shift)) {
      return res
        .status(400)
        .json({ message: "Shift harus 'Pagi', 'Siang', atau 'Malam'" });
    }

    const petugasBaru = new Petugas({ NamaPetugas, Shift });
    await petugasBaru.save();
    res
      .status(201)
      .json({ message: "Petugas berhasil ditambahkan", petugas: petugasBaru });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 PUT - Update petugas berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    const { NamaPetugas, Shift } = req.body;

    // Validasi shift
    if (!["Pagi", "Siang", "Malam"].includes(Shift)) {
      return res
        .status(400)
        .json({ message: "Shift harus 'Pagi', 'Siang', atau 'Malam'" });
    }

    const updatedPetugas = await Petugas.findOneAndUpdate(
      { PetugasID: req.params.id },
      { NamaPetugas, Shift },
      { new: true }
    );

    if (!updatedPetugas)
      return res.status(404).json({ message: "Petugas tidak ditemukan" });
    res.json({
      message: "Petugas berhasil diperbarui",
      petugas: updatedPetugas,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 DELETE - Hapus petugas berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPetugas = await Petugas.findOneAndDelete({
      PetugasID: req.params.id,
    });
    if (!deletedPetugas)
      return res.status(404).json({ message: "Petugas tidak ditemukan" });

    res.json({ message: "Petugas berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
