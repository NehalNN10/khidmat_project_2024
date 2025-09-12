const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  // media_id: { type: Number, required: true, unique: true, autoIncrement: true },
  media_type: { type: String, required: true },
  media_url: { type: String, required: true },
  animal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal",
    required: true,
  },
});

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;