const Contact = require('../models/contact-model');

/**
 * Page Accueil
 * @param req
 * @param res
 */
exports.index = (req, res) => {
    res.redirect('/contacts');
}

/**
 * Page Contacts
 * @param req
 * @param res
 */
exports.contacts = (req, res) => {

    Contact.find((err, contacts) => {

        if (err) console.log(err);

        res.render('contacts', {
            'contacts': contacts.map(contact => contact.toJSON())
        });

    });
}

/**
 * Page Fiche Contact
 * @param req
 * @param res
 */
exports.contact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).exec();
        res.render('contact', {
            'contact': contact.toJSON()
        });
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}
