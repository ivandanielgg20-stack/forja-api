const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones: reutiliza conexiones abiertas en lugar de abrir
// una nueva por cada petición.
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'app_api',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'forja_athletics',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  charset: 'utf8mb4',
  // DECIMAL llega como número (por defecto mysql2 lo entrega como texto)
  decimalNumbers: true,
});

module.exports = pool;
