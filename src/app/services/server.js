const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Verbindung zur db4free-Datenbank
const db = mysql.createConnection({
  host: 'db4free.net', // db4free Hostname
  user: 'userrwt', // Dein db4free-Benutzername
  password: 'talahoon123!', // Dein db4free-Passwort
  database: 'db_rwt', // Deine db4free-Datenbank
});

db.connect((err) => {
  if (err) throw err;
  console.log('Mit der Datenbank verbunden!');
});

// Route für Registrierung
app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  // Überprüfe, ob alle Felder ausgefüllt sind
  if (!email || !username || !password) {
    return res.status(400).send('Bitte fülle alle Felder aus.');
  }

  try {
    // Passwort verschlüsseln
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL-Abfrage, um die Daten zu speichern
    const sql = 'INSERT INTO users (username, password (encrypted), email) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, username], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Fehler beim Speichern der Daten.');
      }
      res.status(201).send('Benutzer erfolgreich registriert!');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ein Fehler ist aufgetreten.');
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});
