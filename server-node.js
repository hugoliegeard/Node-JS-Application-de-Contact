/**
 * Importer le module http.
 * --------------------------
 * Gérer les opérations HTTP
 * @type {module:http}
 */
const http = require('http');

/**
 * Déclaration de notre hôte et du port
 */
const hostname = '127.0.0.1';
const port = 3000;

/**
 * Importer le package URL
 * ------------------------
 * Permet de lire de l'URL et ses données.
 * @type {module:url}
 */
const url = require('url');

/**
 * Importer le package du système de fichier
 * ------------------------------------------
 * Permet d'accéder aux fichiers.
 * @type {module:fs}
 */
const fs = require('fs');

/**
 * Mise en place du serveur
 */
const server = http.createServer((req, res) => {

    let path = url.parse(req.url).pathname;
    // console.log( path );

    if (path === '/contacts') {

        fs.readFile( __dirname + '/views/html/contacts.html', (err, data) => {

            if (err) console.log(err);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);

        });

    } else if (path === '/contact') {

        let params = url.parse(req.url, true).query; // Permet de lire les paramètres dans l'URL
        let contactId = params.id;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<html lang="fr"><body><h1>Fiche Contact ID : ${contactId}</h1></body></html>`);

    } else if (path === '/public/css/styles.css') {

        fs.readFile( __dirname + '/public/css/styles.css', (err, data) => {

            if (err) console.log(err);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            res.end(data);

        });

    } else {

        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html lang="fr"><body><h1>Ooops 404 !?</h1></body></html>');

    }

});

/**
 * Démarrage de l'écoute des connexions
 * sur le port 3000 du serveur.
 */
server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`);
    console.log(`Press CTRL + C to stop\n`);
});
