const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  // category_id: {
  //   type: Number,
  //   required: true,
  //   unique: true,
  //   autoIncrement: true,
  // },
  name: { type: String, required: true },
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
module.exports = Category;