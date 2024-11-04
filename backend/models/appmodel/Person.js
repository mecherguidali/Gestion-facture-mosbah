const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    prenom: {
        type: String,
        required: false
    },
    nom: {
        type: String,
        required: false
    },
    createdBy: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        default: Date.now,
      },
    entreprise: { type: mongoose.Schema.ObjectId, ref: 'Entreprise', autopopulate: true },
    isClient: {
        type: Boolean,
        default: false,
      },
    pays: String,
    telephone: String,
    email: String,
    cin: String

});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
