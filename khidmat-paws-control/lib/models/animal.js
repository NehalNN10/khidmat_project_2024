const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  drive_folder_id: { type: String, unique: true, sparse: true },
});

const Animal = mongoose.models.Animal || mongoose.model("Animal", animalSchema);
module.exports = Animal;