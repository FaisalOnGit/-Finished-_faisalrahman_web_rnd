const express = require("express");
const Transaksi = require("../models/Transaksi");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { KendaraanID, PetugasID, GerbangID, TarifPerjam, WaktuMasuk } =
      req.body;

    const transaksiBaru = new Transaksi({
      KendaraanID,
      PetugasID,
      GerbangID,
      TarifPerjam,
      WaktuMasuk,
    });

    await transaksiBaru.save();
    res.status(201).json({
      message: "Transaksi berhasil dibuat!",
      transaksi: transaksiBaru,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const transaksi = await Transaksi.aggregate([
      {
        $lookup: {
          from: "gerbangs",
          localField: "GerbangID",
          foreignField: "GerbangID",
          as: "Gerbang",
        },
      },
      { $unwind: "$Gerbang" },

      {
        $lookup: {
          from: "petugas",
          localField: "PetugasID",
          foreignField: "PetugasID",
          as: "Petugas",
        },
      },
      { $unwind: "$Petugas" },

      {
        $lookup: {
          from: "kendaraans",
          localField: "KendaraanID",
          foreignField: "KendaraanID",
          as: "Kendaraan",
        },
      },
      { $unwind: "$Kendaraan" },
    ]);

    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 PATCH - Update WaktuKeluar & Hitung Tarif Parkir
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { WaktuKeluar } = req.body;

    if (!WaktuKeluar) {
      return res.status(400).json({ error: "WaktuKeluar harus diisi!" });
    }

    const transaksi = await Transaksi.findOne({ TransaksiID: id });

    if (!transaksi) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    // Hitung Durasi Parkir (dalam jam, dibulatkan ke atas)
    const waktuMasuk = new Date(transaksi.WaktuMasuk);
    const waktuKeluar = new Date(WaktuKeluar);
    let durasiJam = Math.ceil((waktuKeluar - waktuMasuk) / (1000 * 60 * 60)); // Konversi ke jam, bulatkan ke atas

    // Hitung Total Bayar
    let totalBayar = transaksi.TarifPerjam * durasiJam;

    // Update Transaksi
    transaksi.WaktuKeluar = WaktuKeluar;
    transaksi.DurasiParkir = durasiJam;
    transaksi.TotalBayar = totalBayar;

    await transaksi.save();

    res.json({
      message: "Transaksi diperbarui!",
      transaksi,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 GET - Tampilkan Transaksi (Ringkas)
router.get("/simple", async (req, res) => {
  try {
    const transaksi = await Transaksi.aggregate([
      {
        $lookup: {
          from: "kendaraans",
          localField: "KendaraanID",
          foreignField: "KendaraanID",
          as: "Kendaraan",
        },
      },
      { $unwind: "$Kendaraan" },

      {
        $project: {
          _id: 0,
          PlatNomor: "$Kendaraan.PlatNomor",
          JenisKendaraan: "$Kendaraan.Jenis",
          TipeKendaraan: "$Kendaraan.Tipe",
          DurasiParkir: 1,
          TotalBayar: 1,
        },
      },
    ]);

    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 GET - Tampilkan Data Transaksi Sederhana Berdasarkan ID
router.get("/simple/:id", async (req, res) => {
  try {
    const transaksiID = parseInt(req.params.id); // Konversi ID ke angka

    const transaksi = await Transaksi.aggregate([
      { $match: { TransaksiID: transaksiID } },

      {
        $lookup: {
          from: "kendaraans",
          localField: "KendaraanID",
          foreignField: "KendaraanID",
          as: "Kendaraan",
        },
      },
      { $unwind: "$Kendaraan" },

      {
        $project: {
          _id: 0,
          PlatNomor: "$Kendaraan.PlatNomor",
          JenisKendaraan: "$Kendaraan.Jenis",
          TipeKendaraan: "$Kendaraan.Tipe",
          DurasiParkir: 1,
          TotalBayar: 1,
        },
      },
    ]);

    if (!transaksi.length) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan!" });
    }

    res.json(transaksi[0]); // Ambil elemen pertama karena hasilnya array
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
