const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const kendaraanSchema = new mongoose.Schema({
  KendaraanID: { type: Number, unique: true },
  PlatNomor: { type: String, required: true, unique: true },
  Jenis: {
    type: String,
    required: true,
    enum: ["Mobil", "Motor"],
  },
  Tipe: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const mobilTipe = ["Truk", "Bus", "Minibus", "SUV", "Sedan", "Pickup"];
        const motorTipe = ["Moge/Sport", "Bebek/Matic"];
        return (
          (this.Jenis === "Mobil" && mobilTipe.includes(value)) ||
          (this.Jenis === "Motor" && motorTipe.includes(value))
        );
      },
      message: "Tipe kendaraan tidak valid untuk jenis yang dipilih.",
    },
  },
});

kendaraanSchema.plugin(AutoIncrement, { inc_field: "KendaraanID" });

module.exports = mongoose.model("Kendaraan", kendaraanSchema);
