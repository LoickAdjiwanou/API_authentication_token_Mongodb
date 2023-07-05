import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import signupRoute from './routes/signup.js';
import loginRoute from './routes/login.js';

const app = express();
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27020/db');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connection:'));
db.once('open', () => {
  console.log('Connected to Database!');
});

// Utilisation des routes
app.use('/signup', signupRoute);
app.use('/login', loginRoute);

const port = 2000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
