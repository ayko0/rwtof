const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'db4free.net',
  user: 'userrwt',
  password: 'talahoon123!',
  database: 'db_rwt'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
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
        console.error('Error during user registration:', err);
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
        console.error('Error during login:', err);
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
