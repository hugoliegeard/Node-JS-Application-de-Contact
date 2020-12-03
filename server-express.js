/**
 * Import du Framework Express
 * ----------------------------
 * Installation : npm install express
 */
const express = require('express');

/**
 * Initialisation de l'application Express
 * @type {*|Express}
 */
const app = express();
const port = 3000;

/**
 * Configuration du templating Handlebars
 */

const hbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();

helpers.ifIn = (collection = [], param, value) => {
    for (let i = 0; i < collection.length; i++) {
        if (collection[i][param] === value) {
            return collection[i];
        }
    }
    return false;
}

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: helpers
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

/**
 * Récupérer les données POST
 * https://github.com/expressjs/body-parser#readme
 * https://www.npmjs.com/package/body-parser
 */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Configuration de la connexion à MongoDB
 * cf. https://www.npmjs.com/package/mongoose
 * npm install mongoose
 * @type {Mongoose}
 */
const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1/contacts';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/**
 * Configuration des sessions avec Express
 * https://www.npmjs.com/package/express-session
 * https://www.npmjs.com/package/cookie-parser
 */
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(session({
    secret: 'contact-app',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

// Configuration des notifications flash
app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

/**
 * Permet de gérer l'affichage de nos assets
 * https://expressjs.com/fr/starter/static-files.html
 */
app.use('/public', express.static(__dirname + '/public'));

/**
 * Json2XLS Middleware
 */
const json2xls = require('json2xls');
app.use(json2xls.middleware);

/**
 * Mise en Place de Passport
 */
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

const Contact = require('./src/models/contact-model');
passport.use(new Strategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, next) => {
        // look for the user data
        Contact.findOne({ email: email }, (err, contact) => {

            // if there is an error
            if (err) { return next(err); }

            // if contact doesn't exist
            if (!contact) { return next(null, false); }

            // if the password isn't correct
            if (contact.password !== password) {
                return next(null, false);
            }

            // if the contact is properly authenticated
            return next(null, contact);
        });
    }
));

passport.serializeUser((contact, next) => {
    next(null, contact.id);
});

passport.deserializeUser(function(id, next) {
    Contact.findById(id, (err, contact) => {
        if (err) { return next(err); }
        next(null, contact);
    });
});

/**
 * Mise en Place du Routage
 * @type {Router}
 */
const appRouter = require('./src/routes/app-routes');
app.use('/', appRouter);

/** Gestion des erreurs 404 **/
app.use((req, res) => {
    res.status(404).render('error');
});

/**
 * Démarrage du serveur et écoute
 * des connexions sur le port 3000
 */
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
    console.log(`Press CTRL + C to stop\n`);
});
