const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');

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

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.post('/signup', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  const { email, name, password } = req.body;

  const query = 'INSERT INTO tbl_user (email, name, password) VALUES (?, ?, ?)';
  db.query(query, [email, name, password], (err, result) => {
    if (err) {
      console.error('Fehler beim Eintragen der Daten:', err);
      res.status(500).json({ message: 'Fehler beim Eintragen der Daten.' });
      return;
    }
    res.status(200).json({ message: 'Daten erfolgreich eingetragen.' });
  });
});

app.post('/tbl_media', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  const { name, type, genre } = req.body;

  if (!req.files || !req.files.img) {
    console.error('Keine Datei hochgeladen.');
    return res.status(400).json({ message: "Kein Bild hochgeladen." });
  }

  console.log('Anfrage-Body:', req.body); // Hier hinzufügen

  const img = Buffer.from(req.files.img.data);

  console.log('Empfangene Daten:', { name, type, genre });
  console.log('Hochgeladene Datei:', req.files.img);

  const query = 'INSERT INTO tbl_media (name, type, genre, img) VALUES (?, ?, ?, ?)';
  db.query(query, [name, type, genre, Buffer.from(img)], (err, result) => {
    if (err) {
      console.error('Fehler beim Eintragen der Media-Daten:', err);
      res.status(500).json({ message: 'Fehler beim Eintragen der Media-Daten.' });
      return;
    }
    res.status(200).json({ message: 'Media-Daten erfolgreich eingetragen.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
