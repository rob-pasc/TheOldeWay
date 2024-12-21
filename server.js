const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const path = require('path');
const { spawn } = require('child_process');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // Optional for session tokens

const SECRET_KEY = process.env.SECRET_KEY; // Use an env variable for production  || 'your_secret_key'

const app = express();
app.use(cors());
app.use(express.json());

// Register endpoint
// Register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO usr (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ 
      message: "User registered successfully", 
      user, 
      token 
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    console.error(err);
    res.status(500).send('Error registering user');
  }
});


// Login endpoint
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

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

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

// get personal data
app.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, created_at FROM usr WHERE id = $1', [req.user.id]);
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

(async () => {
  try {
    await runSetupScript('createTables.js');
    await runSetupScript('seedData.js');
    console.log("Database setup completed successfully.");
  } catch (err) {
    console.error("Database setup failed:", err);
  }
})();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



