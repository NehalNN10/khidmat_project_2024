const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  animal_id: {
    type: Number,
    required: true,
    unique: true,
    autoIncrement: true,
  },
  name: { type: String, required: true },
  // description: { type: String, required: true },
  description: { type: String},
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Animal = mongoose.model("Animal", animalSchema);
module.exports = Animal;