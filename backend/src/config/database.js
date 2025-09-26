// db.js
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeout: 60000,
  enableKeepAlive: true,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connexion à la BDD réussie.");
    connection.release();
  } catch (err) {
    console.error("❌ Échec de la connexion à la BDD:", err.message);
    console.error("Code erreur:", err.code);
    // process.exit(1);
  }
})();

async function query(sql, params) {
  try {
    const [rows, fields] = await pool.execute(sql, params || []);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

module.exports = { pool, query };
