// Manejador central de errores: convierte cualquier error en una respuesta JSON
// con el mismo formato y el código HTTP que corresponde.
module.exports = (err, req, res, next) => {
  let status = 500;
  let message = 'Error interno del servidor';

  if (err.type === 'entity.parse.failed') {
    // express.json() no pudo leer el cuerpo: JSON mal formado
    status = 400;
    message = 'El cuerpo de la petición no es un JSON válido';
  } else if (err.status) {
    // Errores lanzados por los services: { status, message, errors }
    status = err.status;
    message = err.message;
  }

  // Los errores 500 se registran completos en el servidor, pero al cliente
  // solo se le manda un mensaje genérico (no se exponen detalles de la BD).
  if (status >= 500) {
    console.error(err);
  }

  const payload = {
    status: 'error',
    message,
  };

  if (err.errors) {
    payload.errors = err.errors;
  }

  res.status(status).json(payload);
};
