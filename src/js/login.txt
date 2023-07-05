const express = require('express');
const User = require('../models/user');
const { compare } = require("bcrypt");

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // On recherche si l'utiliasteur existe déja
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Accès invalides" });
    }

    // On compare le mot de passe de l'utilisateur à celui existant
    const result = await compare(password, user.password);
    if (!result) {
      res.status(401).json({ error: "Accès invalides" });
      return;
    }
    
    // Réponse de connection
    res.json({ message: "Connection reussie !"});
    } catch (err) {
      console.error("Utilisateur intouvable:", err);
      res.status(500).json({ error: "Utilisateur intouvable" });
    }  
});

module.exports = router;
