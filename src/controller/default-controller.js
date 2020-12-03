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

   //  res.send(`Hello ${req.user.prenom}. Your session ID is ${req.sessionID}
   // and your session expires in ${req.session.cookie.maxAge}
   // milliseconds.<br><br>
   // <a href="/logout">Log Out</a><br><br>
   // <a href="/secret">Members Only</a>`);

    Contact.find((err, contacts) => {

        if (err) console.log(err);

        res.render('contacts', {
            'contacts': contacts.map(contact => contact.toJSON()),
            'user' : req.user.toJSON()
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
