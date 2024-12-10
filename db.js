require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    await pool.connect();
    console.log("Connected to the PostgreSQL database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
