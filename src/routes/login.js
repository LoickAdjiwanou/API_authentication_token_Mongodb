const express = require('express');
const User = require('../models/user');
const { compare } = require("bcrypt");

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Accès invalides" });
    }

    const result = await compare(password, user.password);
    if (!result) {
      res.status(401).json({ error: "Accès invalides" });
      return;
    }
    
    res.json({ message: "Connection reussie !"});
    } catch (err) {
      console.error("Utilisateur intouvable:", err);
      res.status(500).json({ error: "Utilisateur intouvable" });
    }  
});

module.exports = router;
