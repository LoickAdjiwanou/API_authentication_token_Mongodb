const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  // Vérifier si le nom d'utilisateur existe déjà
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ error: "Veuillez choisir un autre nom d'utilisateur" });
  }

  const user = new User({ username, email, password });
  try {
    await user.save();

    // Générer un token
    const token = jwt.sign({ username: user.username }, 'mongoTOken');

    // Ajout du token au header
    res.header('x-auth-token', token);

    // Renvoyer le token dans la réponse
    res.json({ message: `User ${username} créé !` });
    } catch (err) {
      console.error("Failed to create user:", err);
      res.status(500).json({ error: `Failed to create user ==> ${err.message}` });
    }
});

module.exports = router;
