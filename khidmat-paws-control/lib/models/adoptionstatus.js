const mongoose = require("mongoose");

const adoptionStatusSchema = new mongoose.Schema({
  status_id: {
    type: Number,
    required: true,
    unique: true,
    autoIncrement: true,
  },
  animal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal",
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    // required: true,
  },
  status: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
});

const AdoptionStatus = mongoose.models.AdoptionStatus || mongoose.model("AdoptionStatus", adoptionStatusSchema);
module.exports = AdoptionStatus;