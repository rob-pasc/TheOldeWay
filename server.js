const express = require('express');
const db = require('./db');

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

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.send(`Database connected! Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});

// app.get('/players', async (req, res) => {
//     try {
//       const result = await db.query('SELECT * FROM players');
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error retrieving players');
//     }
//   });
  

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
