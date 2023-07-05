"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var signup_1 = require("./routes/signup");
var login_1 = require("./routes/login");
var app = express_1(); // Utilisez directement l'objet d'application depuis express
app.use(express_1.json()); // Utilisez la méthode json() intégrée d'Express
// Connexion à MongoDB
mongoose_1.default.connect('mongodb://localhost:27020/db');
var db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'Erreur de connection:'));
db.once('open', function () {
    console.log('Connected to Mongo Database!');
});
// Utilisation des routes
app.use('/signup', signup_1.default);
app.use('/login', login_1.default);
var port = 2000;
app.listen(port, function () {
    console.log("Server listening on port " + port);
});
