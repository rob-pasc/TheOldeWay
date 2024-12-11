const express = require('express');
const db = require('./db');

const cors = require('cors');
app.use(cors());

const app = express();
app.use(express.json());

app.post('/players', async (req, res) => {
    const { username, email, password_hash } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO players (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [username, email, password_hash]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding player');
    }
});  

app.get('/', (req, res) => {
  res.send("API is running. Use /players for operations.");
});

app.get('/ich', (req, res) => {
  res.send("Du bist sehr cool, Bruder!");
});

app.get('/players', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM players');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving players');
    }
  });
  
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
