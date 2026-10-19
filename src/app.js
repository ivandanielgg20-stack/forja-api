const express = require('express');
const productosRoutes = require('./routes/productos.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Lee cuerpos JSON (Content-Type: application/json)
app.use(express.json());

// Información general de la API
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API RESTful de Forja Athletics',
    version: '1.0.0',
    endpoints: [
      'GET    /api/v1/productos',
      'GET    /api/v1/productos/:id',
      'POST   /api/v1/productos',
      'PUT    /api/v1/productos/:id',
      'DELETE /api/v1/productos/:id',
    ],
  });
});

// Recurso principal
app.use('/api/v1/productos', productosRoutes);

// Siempre al final: rutas inexistentes y manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
