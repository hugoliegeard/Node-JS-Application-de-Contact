const express =require('express');
const router = express.Router();
const {contactValidator} = require('../validations/contact-validator');

// -- Importation des controlleurs
const defaultController = require('../controller/default-controller');
const contactController = require('../controller/contact-controller');
const securityController = require('../controller/security-controller');
const guard = require('connect-ensure-login');
const passport = require("passport");

// -- Chargement des Routes
router.get('/', defaultController.index);
router.get('/contacts', guard.ensureLoggedIn('/security/login'), defaultController.contacts);
router.get('/contact/:id', guard.ensureLoggedIn('/security/login'), defaultController.contact);

router.get('/export/pdf', guard.ensureLoggedIn('/security/login'), contactController.pdf);
router.get('/export/xlsx', guard.ensureLoggedIn('/security/login'), contactController.xlsx);

// -- Security
router.get('/security/login', securityController.login_get);
router.get('/security/logout', securityController.logout);
router.post('/security/login',
    passport.authenticate('local', { failureRedirect: '/security/login' }),
    securityController.login_post);

// -- Afficher, Editer, Supprimer un Contact
router.get('/ajouter-un-contact', guard.ensureLoggedIn('/security/login'), contactController.create_get);
router.post('/ajouter-un-contact', guard.ensureLoggedIn('/security/login'), contactValidator, contactController.create_post);

router.get('/contact/:id/edit', guard.ensureLoggedIn('/security/login'), contactController.update_get);
router.post('/contact/:id/edit', guard.ensureLoggedIn('/security/login'), contactValidator, contactController.update_post);

router.get('/contact/:id/delete', guard.ensureLoggedIn('/security/login'), contactController.delete);

// -- Exportation du router avec nos routes
module.exports = router;
