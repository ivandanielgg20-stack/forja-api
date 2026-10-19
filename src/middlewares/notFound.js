// Cualquier ruta que no exista responde 404 en JSON (no en HTML).
module.exports = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};
