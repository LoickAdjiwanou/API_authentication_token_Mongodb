import express from 'express';
const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoURL = 'mongodb://localhost:27017'; // Remplacez par votre URL de connexion
const dbName = 'mydatabase'; // Remplacez par le nom de votre base de données

MongoClient.connect(mongoURL, (err, client) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }
  const db = client.db(dbName);
  console.log('Connected to the database');
  // Continuez à écrire votre code ici
});
