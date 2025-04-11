const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const transaksiSchema = new mongoose.Schema({
  TransaksiID: { type: Number, unique: true },
  KendaraanID: { type: Number, required: true, ref: "Kendaraan" }, // Pastikan tipe Number
  PetugasID: { type: Number, required: true, ref: "Petugas" }, // Pastikan tipe Number
  GerbangID: { type: Number, required: true, ref: "Gerbang" }, // Pastikan tipe Number
  TarifPerjam: { type: Number, required: true },
  WaktuMasuk: { type: Date, required: true },
  WaktuKeluar: { type: Date },
  DurasiParkir: { type: Number, default: 0 },
  TotalBayar: { type: Number, default: 0 },
});

// Auto-increment TransaksiID
transaksiSchema.plugin(AutoIncrement, { inc_field: "TransaksiID" });

module.exports = mongoose.model("Transaksi", transaksiSchema);
