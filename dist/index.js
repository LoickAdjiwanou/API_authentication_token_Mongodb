"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var body_parser_1 = require("body-parser");
var signup_js_1 = require("./routes/signup.js");
var login_js_1 = require("./routes/login.js");
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Connexion à MongoDB
mongoose_1.default.connect('mongodb://localhost:27020/db');
var db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'Erreur de connection:'));
db.once('open', function () {
    console.log('Connected to Database!');
});
// Utilisation des routes
app.use('/signup', signup_js_1.default);
app.use('/login', login_js_1.default);
var port = 2000;
app.listen(port, function () {
    console.log("Server listening on port ".concat(port));
});
