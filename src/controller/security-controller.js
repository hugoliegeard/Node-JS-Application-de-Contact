const Contact = require('../models/contact-model');
const passport = require("passport");

/**
 * Page Connexion
 * ------------------------------
 * Afficher le formulaire
 * @param req
 * @param res
 */
exports.login_get = (req, res) => {
    res.render('security/login');
}

/**
 * Page Créer un Contact
 * ------------------------------
 * Traitement des données POST
 * @param req
 * @param res
 */
exports.login_post = (req, res) => {
    res.redirect('/');
}

/**
 * Page Déconnexion
 * ------------------------------
 * Traitement des données POST
 * @param req
 * @param res
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}
