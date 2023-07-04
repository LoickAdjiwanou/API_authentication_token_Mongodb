const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');

const app = express();
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27020/api_token', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connection:'));
db.once('open', () => {
  console.log('Connected to Mongo Database !');
});

// Utilisation des routes
app.use('/signup', signupRoute);
app.use('/login', loginRoute);

const port = 2000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
