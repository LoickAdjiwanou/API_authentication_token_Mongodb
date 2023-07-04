const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/api_token', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connection:'));
db.once('open', () => {
  console.log('Connection reussie !');
});

// Définition modèle utilisateur
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', userSchema);

// Route pour créer un nouvel utilisateur
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  try {
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Failed to create user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// Route pour se connecter en tant qu'utilisateur
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      console.error('Utilisateur intouvable:', err);
      res.status(500).json({ error: 'Utilisateur intouvable' });
      return;
    }
    if (!user) {
      res.status(401).json({ error: 'Accès invalides' });
      return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        res.status(401).json({ error: 'Accès invalides' });
        return;
      }
      res.json({ message: 'Connection reussie' });
    });
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
