const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const petugasSchema = new mongoose.Schema({
  PetugasID: { type: Number, unique: true },
  NamaPetugas: { type: String, required: true },
  Shift: {
    type: String,
    required: true,
    enum: ["Pagi", "Siang", "Malam"],
    message: "Shift harus bernilai Pagi, Siang, atau Malam.",
  },
});

petugasSchema.plugin(AutoIncrement, { inc_field: "PetugasID" });

module.exports = mongoose.model("Petugas", petugasSchema);
