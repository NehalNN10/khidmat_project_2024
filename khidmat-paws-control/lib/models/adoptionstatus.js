// lib/models/AdoptionStatus.js
import mongoose from 'mongoose';

const adoptionStatusSchema = new mongoose.Schema({
  animal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: String },
  updated_at: { type: Date, default: Date.now },
});

const AdoptionStatus = mongoose.models.AdoptionStatus || mongoose.model('AdoptionStatus', adoptionStatusSchema);

export default AdoptionStatus;
