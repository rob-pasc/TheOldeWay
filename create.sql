CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash TEXT NOT NULL
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  player1_id INT REFERENCES players(id),
  player2_id INT REFERENCES players(id),
  winner_id INT REFERENCES players(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
