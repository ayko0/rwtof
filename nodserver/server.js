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
    console.error('Fehler bei der Verbindung zur Datenbank:', err);
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
  if (!name || !type || !genre) {
    return res.status(400).json({ message: "Name, Typ und Genre sind erforderlich." });
  }

  if (!req.files || !req.files.img) {
    console.error('Keine Datei hochgeladen.');
    return res.status(400).json({ message: "Kein Bild hochgeladen." });
  }

  const img = req.files.img.data;
  //console.log('Anfrage-Body:', req.body); // Hier hinzufügen

  //const img = Buffer.from(req.files.img.data);

  console.log('Empfangene Daten:', { name, type, genre });
  console.log('Hochgeladene Datei:', req.files.img);

  const query = 'INSERT INTO tbl_media (name, type, genre, img) VALUES (?, ?, ?, ?)';
  db.query(query, [name, type, genre, img], (err, result) => {
    if (err) {
      console.error('Fehler beim Eintragen der Media-Daten:', err);
      res.status(500).json({ message: 'Fehler beim Eintragen der Media-Daten.' });
      return;
    }
    res.status(200).json({ message: 'Media-Daten erfolgreich eingetragen.' });
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
      res.status(200).json({ message: 'Login erfolgreich.', id: user.userID, username: user.username , email: user.email });
    });
  });
});

app.get('/tbl_media/:id', (req, res) => {
  const mediaId = req.params.id;
  const query = 'SELECT img FROM tbl_media WHERE id = ?';
  db.query(query, [mediaId], (err, result) => {
    if (err) {
      console.error('Fehler beim Abrufen der Bilddaten:', err);
      return res.status(500).json({ message: 'Fehler beim Abrufen der Bilddaten.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Bild nicht gefunden.' });
    }

    const img = result[0].img;  // Binärdaten des Bildes

    // Setzen Sie den Header, um den Bildinhalt korrekt zu senden
    res.setHeader('Content-Type', 'image/png');
    res.send(img);
  });
});

app.get('/media', (req, res) => {
  const query = 'SELECT * FROM tbl_media';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Medien:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.post('/media-tracking', (req, res) => {
  const { mediaID, userID, goal_type, goal_description, progress } = req.body;
  const query = `INSERT INTO tbl_media_tracking 
                 (mediaID, userID, goal_type, goal_description, progressDate, progress) 
                 VALUES (?, ?, ?, ?, CURDATE(), ?)`;
  db.query(query, [mediaID, userID, goal_type, goal_description, progress], (err, result) => {
    if (err) {
      console.error('Fehler beim Eintragen der Tracking-Daten:', err);
      res.status(500).json({ message: 'Fehler beim Eintragen der Tracking-Daten.' });
      return;
    }
    res.status(200).json({ message: 'Tracking-Daten erfolgreich eingetragen.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
