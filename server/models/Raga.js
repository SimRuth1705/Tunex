const mongoose = require('mongoose');

const RagaSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  
  notes: [{ 
    type: Number, 
    required: true 
  }],
  
  suggestedChords: [{ 
    type: String 
  }]
});

module.exports = mongoose.model('Raga', RagaSchema);