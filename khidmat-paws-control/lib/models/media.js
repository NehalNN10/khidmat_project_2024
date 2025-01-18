// lib/models/Media.js
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  media_type: { type: String, required: true },
  media_url: { type: String, required: true },
  animal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
});

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;
