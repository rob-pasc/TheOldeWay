const db = require('./db');

const seedData = async () => {
  try {
    // Insert sample players
    await db.query(`
        INSERT INTO players (username, email, password_hash) VALUES
        ('Player1', 'player1@example.com', 'hashedpassword1'),
        ('Player2', 'player2@example.com', 'hashedpassword2');
    `);

    // Insert sample games
    await db.query(`
        INSERT INTO matches (player1_id, player2_id, winner_id) VALUES
        (1, 2, 1),
        (2, 1, 2);
    `);

    console.log("Data seeded successfully.");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    process.exit();
  }
};

// Execute the function when this file is called
seedData();
