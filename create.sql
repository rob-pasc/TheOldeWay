-- Tables for non-game related stuff
CREATE TABLE IF NOT EXISTS usr (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Static tables, read-only at runtime
CREATE TABLE IF NOT EXISTS card (
  card_id SERIAL PRIMARY KEY, 
  name VARCHAR(255) NOT NULL UNIQUE,
  descr VARCHAR(255),
  symbol VARCHAR(255),
  image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS deck (
  deck_id SERIAL PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  amount_cards INT DEFAULT 0 CHECK (amount_cards >= 0)
);

CREATE TABLE IF NOT EXISTS map (
  deck_id INT NOT NULL,
  card_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 1),
  PRIMARY KEY (deck_id, card_id),
  FOREIGN KEY (deck_id) REFERENCES deck(deck_id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES card(card_id) ON DELETE CASCADE
);

-- Tables for ongoing matches
CREATE TABLE IF NOT EXISTS ongoing_match (
  id SERIAL PRIMARY KEY,
  player1 INT REFERENCES usr(id),
  player2 INT REFERENCES usr(id),
  game_started TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
