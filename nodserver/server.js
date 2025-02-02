const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:8100',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//dbverbindung
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
  console.log('Empfangene Daten:', { name, type, genre });
  console.log('Hochgeladene Datei:', req.files.img);

  // Holen Sie die Genre-ID basierend auf dem Genre-Namen ab
  const getGenreIdQuery = 'SELECT id FROM tbl_genre WHERE name = ?';
  db.query(getGenreIdQuery, [genre], (err, genreResult) => {
    if (err) {
      console.error('Fehler beim Abrufen der Genre-ID:', err);
      res.status(500).json({ message: 'Fehler beim Abrufen der Genre-ID.' });
      return;
    }

    if (genreResult.length === 0) {
      return res.status(404).json({ message: 'Genre nicht gefunden.' });
    }

    const genreId = genreResult[0].id;

    const query = 'INSERT INTO tbl_media (name, type, genre, img) VALUES (?, ?, ?, ?)';
    db.query(query, [name, type, genreId, Buffer.from(img)], (err, result) => {
      if (err) {
        console.error('Fehler beim Eintragen der Media-Daten:', err);
        res.status(500).json({ message: 'Fehler beim Eintragen der Media-Daten.' });
        return;
      }
      res.status(200).json({ message: 'Media-Daten erfolgreich eingetragen.' });
    });
  });
});

app.get('/tbl_media', (req, res) => {
  const mediaType = req.query.type;
  const mediaGenre = req.query.genre;
  console.log('Anfrage für Medien des Typs:', mediaType, 'und Genres:', mediaGenre);
  
  let query = 'SELECT id, name, img FROM tbl_media WHERE type = ? AND genre = ?';
  const params = [mediaType, mediaGenre];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Mediendaten:', err);
      return res.status(500).json({ message: 'Fehler beim Abrufen der Mediendaten.' });
    }

    console.log('Erhaltene Daten:', results);
    res.json(results);
  });
});

app.post('/tbl_tracked', (req, res) => {
  const { mediaID, userID, type, genre, finished, comments } = req.body;
  
  if (!mediaID) {
    return res.status(400).json({ message: 'mediaID ist erforderlich.' });
  }

  const query = 'INSERT INTO tbl_tracked (mediaID, userID, type, genre, finished, comments) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [mediaID, userID, type, genre, finished, comments];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Tracken des Mediums:', err);
      return res.status(500).json({ message: 'Fehler beim Tracken des Mediums.' });
    }

    console.log('Medium erfolgreich getrackt:', results);
    res.status(201).json({ message: 'Medium erfolgreich getrackt.', id: results.insertId });
  });
});
app.post('/signup', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  const { email, username, password } = req.body;
  const picture = 1;

  console.log('Empfangene Daten:', { email, username, password });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Gehashtes Passwort:', hashedPassword);

    const query = 'INSERT INTO tbl_user (email, username, password, picture) VALUES (?, ?, ?, ?)';
    db.query(query, [email, username, hashedPassword, picture], (err, result) => {
      if (err) {
        console.error('Fehler beim Eintragen der Daten:', err);
        res.status(500).json({ message: 'Fehler beim Eintragen der Daten.' });
        return;
      }
      res.status(200).json({ message: 'Daten erfolgreich eingetragen.' });
    });
  } catch (error) {
    console.error('Fehler beim Hashen des Passworts:', error);
    res.status(500).json({ message: 'Fehler beim Hashen des Passworts.' });
  }
});

app.post('/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  const { username, password } = req.body;
  const query = 'SELECT userID, email, username, password, picture FROM tbl_user WHERE username = ?';
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
      res.status(200).json({
        message: 'Login erfolgreich.',
        id: user.userID,
        username: user.username,
        email: user.email,
        picture: user.picture
      });
    });
  });
});
app.post('/update-picture', (req, res) => {
  const { userId, picture } = req.body;
  const query = 'UPDATE tbl_user SET picture = ? WHERE userID = ?';
  db.query(query, [picture, userId], (err, result) => {
    if (err) {
      console.error('Fehler beim Aktualisieren des Profilbildes:', err);
      res.status(500).json({ message: 'Fehler beim Aktualisieren des Profilbildes.' });
      return;
    }
    res.status(200).json({ message: 'Profilbild erfolgreich aktualisiert.' });
  });
});
app.get('/statistics', (req, res) => {
  const query = `
    SELECT genre, type, COUNT(*) as count
    FROM tbl_tracked
    GROUP BY genre, type;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Statistikdaten:', err);
      return res.status(500).json({ message: 'Fehler beim Abrufen der Statistikdaten.' });
    }
    res.json(results);
  });
});

app.get('/user-trackings/:userID', (req, res) => {
  const userID = req.params.userID;
  
  let query = 'SELECT id, mediaID, comments, finished FROM tbl_tracked WHERE userID = ?';
  const params = [userID];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Trackings:', err);
      return res.status(500).json({ message: 'Fehler beim Abrufen der Trackings.' });
    }
    res.status(200).json(results);
  });
});

app.put('/tbl_tracked/:id', (req, res) => {
  const { comments, finished } = req.body;
  const { id } = req.params;

  let query = 'UPDATE tbl_tracked SET comments = ?, finished = ? WHERE id = ?';
  const params = [comments, finished, id];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Aktualisieren des Trackings:', err);
      return res.status(500).json({ message: 'Fehler beim Aktualisieren des Trackings.' });
    }
    res.status(200).json({ message: 'Tracking erfolgreich aktualisiert.', results });
  });
});


app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
