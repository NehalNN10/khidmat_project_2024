// lib/models/media.js
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  media_type: { type: String, required: true },
  media_url: { type: String, required: true },
  filename: { type: String, required: true }, // NEW FIELD
  animal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true }
});

// Create compound index to prevent duplicates
mediaSchema.index({ animal_id: 1, filename: 1 }, { unique: true });

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;