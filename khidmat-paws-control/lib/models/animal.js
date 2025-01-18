// lib/models/Animal.js
import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String },
});

const Animal = mongoose.models.Animal || mongoose.model('Animal', animalSchema);

export default Animal;
