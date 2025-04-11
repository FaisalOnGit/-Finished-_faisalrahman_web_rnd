const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const gerbangSchema = new mongoose.Schema({
  GerbangID: { type: Number, unique: true },
  NamaGerbang: { type: String, required: true },
  TipeGerbang: { type: String, enum: ["Masuk", "Keluar"], required: true },
  Lokasi: { type: String, required: true },
});

// Auto-increment GerbangID
gerbangSchema.plugin(AutoIncrement, { inc_field: "GerbangID" });

module.exports = mongoose.model("Gerbang", gerbangSchema);
