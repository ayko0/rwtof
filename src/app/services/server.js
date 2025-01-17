const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

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
app.post('/tbl_media', (req, res) => {
  const {name, type, genre } = req.body;
  db.query(
    'INSERT INTO tbl_media (name, type, genre) VALUES (?, ?, ?)',
    [name, type, genre],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send('Media entry added');
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
