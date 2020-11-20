const {check} = require('express-validator');

/**
 * Validation du Formulaire Contact
 * cf. https://github.com/validatorjs/validator.js#validators
 * cf. https://github.com/validatorjs/validator.js#sanitizers
 */
exports.contactValidator = [
    check('prenom').trim().notEmpty().withMessage('Vous devez saisir le prénom'),
    check('nom').trim().notEmpty().withMessage('Vous devez saisir le nom'),
    check('email').trim().normalizeEmail()
        .notEmpty().withMessage('Vous devez saisir l\'email')
        .isEmail().withMessage('Le format de l\'email est incorrect'),
    check('tel').blacklist(' ').isMobilePhone('fr-FR')
        .withMessage('Vérifiez le format du numéro de téléphone')
];
