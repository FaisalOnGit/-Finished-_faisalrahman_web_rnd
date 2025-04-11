const express = require("express");
const router = express.Router();
const Gerbang = require("../models/Gerbang");

router.get("/", async (req, res) => {
  try {
    const gerbangList = await Gerbang.find();
    res.json(gerbangList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const gerbang = await Gerbang.findOne({ GerbangID: req.params.id });
    if (!gerbang)
      return res.status(404).json({ message: "Gerbang tidak ditemukan" });
    res.json(gerbang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { NamaGerbang, TipeGerbang, Lokasi } = req.body;

    if (!["Masuk", "Keluar"].includes(TipeGerbang)) {
      return res
        .status(400)
        .json({ message: "TipeGerbang harus 'Masuk' atau 'Keluar'" });
    }

    const gerbangBaru = new Gerbang({ NamaGerbang, TipeGerbang, Lokasi });
    await gerbangBaru.save();
    res
      .status(201)
      .json({ message: "Gerbang berhasil ditambahkan", gerbang: gerbangBaru });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { NamaGerbang, TipeGerbang, Lokasi } = req.body;
    const updatedGerbang = await Gerbang.findOneAndUpdate(
      { GerbangID: req.params.id },
      { NamaGerbang, TipeGerbang, Lokasi },
      { new: true }
    );

    if (!updatedGerbang)
      return res.status(404).json({ message: "Gerbang tidak ditemukan" });
    res.json({
      message: "Gerbang berhasil diperbarui",
      gerbang: updatedGerbang,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedGerbang = await Gerbang.findOneAndDelete({
      GerbangID: req.params.id,
    });
    if (!deletedGerbang)
      return res.status(404).json({ message: "Gerbang tidak ditemukan" });

    res.json({ message: "Gerbang berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
