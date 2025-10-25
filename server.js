// server.js
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Datos básicos del estudiante
const estudiante = {
  nombre: "Daniel Alexander Reyes Perez",
  expediente: "26032",
  codigo: "RP22-I04-002"
};

// Endpoint raíz
app.get('/', (_req, res) => {
  res.json({
    mensaje: 'Servicio Parcial 2 - Implantación de Sistemas',
    estudiante
  });
});

// Endpoint de health
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

import pkg from 'pg';
const { Pool } = pkg;

// Pool PostgreSQL usando variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'parcial_db',
});

// Endpoint /db-check
app.get('/db-check', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, expediente, codigo FROM estudiantes ORDER BY id ASC;'
    );
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`API escuchando en http://0.0.0.0:${PORT}`);
});
