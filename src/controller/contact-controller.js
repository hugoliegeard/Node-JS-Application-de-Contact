const {validationResult} = require('express-validator');
const Contact = require('../models/contact-model');
const puppeteer = require('puppeteer')

/**
 * Page Créer un Contact
 * ------------------------------
 * Afficher le formulaire
 * @param req
 * @param res
 */
exports.create_get = (req, res) => {
    res.render('contact/new-contact');
}

/**
 * Page Créer un Contact
 * ------------------------------
 * Traitement des données POST
 * @param req
 * @param res
 */
exports.create_post = (req, res) => {

    // 1. Récupération & Vérification des données
    const body = req.body;
    // console.log(body);

    const errors = validationResult(req);
    // console.log(errors);

    if (!errors.isEmpty()) {

        res.render('contact/new-contact', {
            'errors': errors.array(),
            'body': body
        });

    } else {

        // 2. Sauvegarde des données dans la base
        const contact = new Contact(body);
        contact.save(err => {
            if (err) console.log(err);

            // 3. Notification & Confirmation
            req.session.flash = {
                type: 'success',
                message: 'Votre contact a bien été ajouté !'
            };

            // 4. Redirection sur la Fiche du Contact
            res.redirect(`/contact/${contact._id}`);

        });

    }

}

/**
 * Page Editer un Contact
 * ------------------------------
 * Afficher le formulaire
 * @param req
 * @param res
 */
exports.update_get = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).exec();
        res.render('contact/edit-contact', {
            'body': contact.toJSON()
        });
    } catch (err) {
        req.session.flash = {type: 'danger', message: 'Ooops, mise à jour impossible !'};
        res.redirect(`/contact/${req.params.id}`);
    }
}

/**
 * Page Editer un Contact
 * ------------------------------
 * Traitement des données POST
 * @param req
 * @param res
 */
exports.update_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('contact/edit-contact', {
            'errors': errors.array(),
            'body': req.body
        });
    } else {
        try {
            await Contact.findByIdAndUpdate(req.params.id, req.body).exec();
            req.session.flash = {type: 'success', message: 'Votre contact est à jour !'};
            res.redirect(`/contact/${req.params.id}`);
        } catch (err) {
            req.session.flash = {type: 'danger', message: 'Ooops, mise à jour impossible !'};
            res.redirect(`/contact/${req.params.id}`);
        }
    }
}

/**
 * Page Supprimer un Contact
 * @param req
 * @param res
 */
exports.delete = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id).exec();
        req.session.flash = {type: 'success', message: 'Le contact a bien été supprimé !'};
        res.redirect('/contacts');
    } catch (err) {
        req.session.flash = {type: 'danger', message: 'Ooops, suppression impossible !'};
        res.redirect('/contacts');
    }
}

/**
 * Générer un PDF
 * https://github.com/hardeeksharma/html-to-pdf-puppeteer
 * ------------------------------
 * npm i puppeteer
 * @param req
 * @param res
 */
exports.pdf = async (req, res) => {

    try {
        const contacts = await Contact.find().exec();
        res.render('contacts-pdf', {'contacts': contacts.map(contact => contact.toJSON())}, (
            async (err, html) => {

                const browser = await puppeteer.launch();
                const page = await browser.newPage()
                await page.setContent(html)
                const pdfName = `contacts-${Date.now()}.pdf`;
                await page.pdf({
                    path: `public/pdf/${pdfName}`,
                    format: 'A4'
                });

                await browser.close();
                res.redirect(`/public/pdf/${pdfName}`);
            }
        ));

    } catch (err) {
        return res.status(500).send({message: err.message});
    }

}

/**
 * Générer un fichier Excel
 *
 * ------------------------------
 *
 * @param req
 * @param res
 */
exports.xlsx = async (req, res) => {

    try {

        const xlsxContacts = [];
        const contacts = await Contact.find().exec();
        contacts.map(contact => contact.toJSON())

        for (let contact of contacts) {
            xlsxContacts.push({
               id : contact._id,
               prenom: contact.prenom,
               nom: contact.nom,
               email: contact.email,
               tel: contact.tel,
            });
        }

        //res.json(xlsxContacts);
        res.xls('contacts.xlsx', xlsxContacts);

    } catch (err) {
        return res.status(500).send({message: err.message});
    }

}
