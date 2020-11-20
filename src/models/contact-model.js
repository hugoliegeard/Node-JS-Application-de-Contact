const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Ici, je vais décrire à quoi doit
 * ressembler un contact dans ma collection.
 * https://mongoosejs.com/docs/models.html
 */
const ContactSchema = Schema({
   prenom: String,
   nom: String,
   email: String,
   tel: String,
   createdAt: { type: Date, default : Date.now() }
});

module.exports = mongoose.model('Contact', ContactSchema);
