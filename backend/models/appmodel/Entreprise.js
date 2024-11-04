const mongoose = require('mongoose');

// Define the schema for the form data
const entrepriseSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: false,
  },
  pays: {
    type: String,
  },
  telephone: {
    type: String,
  },
  email: {
    type: String,
  
  },
  siteweb: {
    type: String,
  },
  createdBy: {
    type: String,
    required: false
},
created: {
    type: Date,
    default: Date.now,
  },
  isClient: {
    type: Boolean,
    default: false,
  },
  rib: {
    type: String,
    required: false
   
  },
  fisc: {
    type: String,
    required: false
   
  }
});

// Create and export the model
const Entreprise = mongoose.model('Entreprise', entrepriseSchema);
module.exports = Entreprise;
