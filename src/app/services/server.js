const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const app = express();

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const db = mysql.createConnection({
  host: 'db4free.net',
  user: 'userrwt',
  password: 'talahoon123!',
  database: 'db_rwt'
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO tbl_user (email, username, password) VALUES (?, ?, ?)',
    [email, username, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send('User registered');
    }
  );
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT * FROM tbl_user WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(401).send('User not found');
      }
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send('Password incorrect');
      }
      res.send('Login successful');
    }
  );
});

// Media entry endpoint
app.post('/tbl_media', upload.single('img'), (req, res) => {
  const {name, type, genre } = req.body;
  const img = fs.readFileSync(req.file.path);
  db.query(
    'INSERT INTO tbl_media (name, type, genre, img) VALUES (?, ?, ?, ?)',
    [name, type, genre, img],
    (err, result) => {
      if (err) {
        console.error('Fehler bei der Datenbankiseration:', err);
        return res.status(500).send('Fehler bei der Datenbankinsertion');
      }
      fs.unlinkSync(req.file.path);
      res.status(201).send('Media entry added');
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
