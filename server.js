const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const path = require('path');
const { spawn } = require('child_process');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const SECRET_KEY = process.env.SECRET_KEY; 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO usr (username, password_hash) VALUES ($1, $2) RETURNING user_id, username',
      [username, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.user_id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ 
      message: "User registered successfully", 
      user, 
      token 
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const result = await db.query('SELECT * FROM usr WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.user_id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    await db.query('UPDATE usr SET times_logged_in = times_logged_in+1 WHERE username = $1', [username]);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

// for JWT TOken auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT user_id, username, created_at, times_logged_in, is_admin FROM usr WHERE user_id = $1', [req.user.id]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user data');
  }
});

app.get('/', (req, res) => {
  res.send("API is running.");
});

app.get('/ich', (req, res) => {
  res.send("Du bist sehr cool, Bruder!");
});

app.get('/user', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usr');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user');
  }
});

app.get('/decks', async (req, res) => {
  try {
    const result = await db.query('SELECT deck_id, deck_name FROM deck');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving decks');
  }
});

app.get('/decks/:deckId', async (req, res) => {
  const { deckId } = req.params;
  try {
    const result = await db.query('SELECT deck_id, deck_name FROM deck WHERE deck_id = $1', [deckId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deck not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving deck');
  }
});

app.get('/decks/:deckId/cards', async (req, res) => {
  const { deckId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.card_id, c.card_name, c.card_type, b.quantity, com.might
       FROM build b 
       JOIN card c ON b.card_id = c.card_id 
       LEFT JOIN combatant com ON c.card_id = com.comb_id
       WHERE b.deck_id = $1`,
      [deckId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving cards');
  }
});

// Endpoint to get card details by ID
app.get('/cards/:cardId', async (req, res) => {
  const { cardId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.card_id, c.card_name, c.card_desc, c.card_type, 
              com.might, com.ability, sp.effect
       FROM card c
       LEFT JOIN combatant com ON c.card_id = com.comb_id
       LEFT JOIN spell sp ON c.card_id = sp.spell_id
       WHERE c.card_id = $1`,
      [cardId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving card details');
  }
});

app.post('/friend-request', authenticateToken, async (req, res) => {
  const { friendUsername } = req.body;

  try {
    const result = await db.query('SELECT user_id FROM usr WHERE username = $1', [friendUsername]);
    const friend = result.rows[0];

    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }

    await db.query(
      'INSERT INTO friendlist (user1, user2, friend_status) VALUES ($1, $2, $3)',
      [req.user.id, friend.user_id, 'pending']
    );

    res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending friend request');
  }
});

app.get('/friend-requests', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT u.user_id, u.username FROM friendlist f JOIN usr u ON f.user1 = u.user_id WHERE f.user2 = $1 AND f.friend_status = $2',
      [req.user.id, 'pending']
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving friend requests');
  }
});

app.post('/accept-friend-request', authenticateToken, async (req, res) => {
  const { userId } = req.body;

  try {
    await db.query(
      'UPDATE friendlist SET friend_status = $1 WHERE user1 = $2 AND user2 = $3',
      ['accepted', userId, req.user.id]
    );

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error accepting friend request');
  }
});

app.post('/reject-friend-request', authenticateToken, async (req, res) => {
  const { userId } = req.body;

  try {
    await db.query(
      'UPDATE friendlist SET friend_status = $1 WHERE user1 = $2 AND user2 = $3',
      ['rejected', userId, req.user.id]
    );

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rejecting friend request');
  }
});

const runSetupScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'db', scriptName);
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`Script ${scriptName} exited with code ${code}`);
        reject(new Error(`Script ${scriptName} failed`));
      } else {
        console.log(`Script ${scriptName} completed successfully.`);
        resolve();
      }
    });
  });
};

// (async () => {
//   try {
//     await runSetupScript('createTables.js');
//     await runSetupScript('seedData.js');
//     console.log("Database setup completed successfully.");
//   } catch (err) {
//     console.error("Database setup failed:", err);
//   }
// })();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



