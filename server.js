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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API escuchando en http://0.0.0.0:${PORT}`);
});
