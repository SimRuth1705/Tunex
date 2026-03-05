const mongoose = require('mongoose');

// 🌟 UPDATED SCHEMA TO MATCH YOUR CSV DATABASE
const RagaSchema = new mongoose.Schema({
  No: { type: Number },
  "Raga Name": { type: String },
  "Scale (Notes)": { type: String },
  "Chord 1 (Notes)": { type: String },
  "Chord 2 (Notes)": { type: String },
  "Chord 3 (Notes)": { type: String },
  Chakra: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Raga', RagaSchema);