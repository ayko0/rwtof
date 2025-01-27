const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// CORS-Konfiguration
app.use(cors({
  origin: 'http://localhost:8100',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL-Datenbankverbindung
const db = mysql.createConnection({
  host: 'db4free.net',
  user: 'userrwt',
  password: 'talahoon123!',
  database: 'db_rwt'
});

db.connect((err) => {
  if (err) {
    console.error('Fehler bei der Verbindung zur Datenbank:', err.stack);
    return;
  }
  console.log('Verbunden mit der Datenbank');
});

app.get('/', (req, res) => {
  res.send('Server ist erreichbar und funktioniert korrekt.');
});

app.post('/signup', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  const { email, username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Fehler beim Verschlüsseln des Passworts:', err);
      res.status(500).json({ message: 'Fehler beim Verschlüsseln des Passworts.' });
      return;
    }
    const query = 'INSERT INTO tbl_user (email, username, password) VALUES (?, ?, ?)';
    db.query(query, [email, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Fehler beim Eintragen der Daten:', err);
        res.status(500).json({ message: 'Fehler beim Eintragen der Daten.' });
        return;
      }
      res.status(200).json({ message: 'Daten erfolgreich eingetragen.' });
    });
  });
});
app.post('/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  const { username, password } = req.body;
  const query = 'SELECT userID, email, username, password FROM tbl_user WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Daten:', err);
      res.status(500).json({ message: 'Fehler beim Abrufen der Daten.' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ message: 'Benutzername nicht gefunden.' });
      return;
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Fehler beim Vergleichen der Passwörter:', err);
        res.status(500).json({ message: 'Fehler beim Vergleichen der Passwörter.' });
        return;
      }
      if (!isMatch) {
        res.status(401).json({ message: 'Falsches Passwort.' });
        return;
      }
      res.status(200).json({ message: 'Login erfolgreich.', id: user.userID, username: user.username , email: user.email});
    });
  });
});
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
