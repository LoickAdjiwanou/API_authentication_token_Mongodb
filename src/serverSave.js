const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { genSalt, hash, compare } = require("bcrypt");
const mongoose = require("mongoose");

const jwt = require('jsonwebtoken');


app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27020/api_token", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connection:"));
db.once("open", () => {
  console.log("Connected to Mongo Database !");
});

// Définition modèle utilisateur
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
  // bcrypt.genSalt(10, (err, salt) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   bcrypt.hash(this.password, salt, (err, hash) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     this.password = hash;
  //     next();
  //   });
  // });
});

const User = mongoose.model("User", userSchema);

// Route pour créer un nouvel utilisateur
app.post("/signup", async (req, res) => {
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

    //Ajout du token au header
    res.header('x-auth-token', token);

    // Renvoyer le token dans la réponse
    res.json({ message: `User ${username} crééres.header('x-auth-token', token); !` });
  } catch (err) {
    console.error("Failed to create user:", err);
    res.status(500).json({ error: `Failed to create user ==> ${err.message}` });
  }
});

// Route pour se connecter en tant qu'utilisateur

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // User.findOne({ username }, (err, user) => {
  //   if (err) {
  //     console.error("Utilisateur intouvable:", err);
  //     res.status(500).json({ error: "Utilisateur intouvable" });
  //     return;
  //   }
  //   if (!user) {
  //     res.status(401).json({ error: "Accès invalides" });
  //     return;
  //   }
  //   bcrypt.compare(password, user.password, (err, result) => {
  //     if (err || !result) {
  //       res.status(401).json({ error: "Accès invalides" });
  //       return;
  //     }
  //     res.json({ message: "Connection reussie" });
  //   });
  // });
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
  
    res.json({ message: "Connection reussie !", token: req.body.token});
  } catch (err) {
    console.error("Utilisateur intouvable:", err);
    res.status(500).json({ error: "Utilisateur intouvable" });
  }  
});


const port = 2000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


