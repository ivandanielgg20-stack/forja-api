const productosService = require('../services/productos.service');

// Capa HTTP: recibe la petición, llama al service y responde JSON
// con el código de estado correcto. Los errores pasan al errorHandler con next(err).

// GET /api/v1/productos -> 200
const getAll = async (req, res, next) => {
  try {
    const productos = await productosService.getAll();
    res.status(200).json({
      status: 'success',
      total: productos.length,
      data: productos,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/productos/:id -> 200 | 400 | 404
const getById = async (req, res, next) => {
  try {
    const producto = await productosService.getById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: producto,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/productos -> 201 | 400
const create = async (req, res, next) => {
  try {
    const producto = await productosService.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Registro creado exitosamente',
      id: producto.producto_id,
      data: producto,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/productos/:id -> 200 | 400 | 404
const update = async (req, res, next) => {
  try {
    const producto = await productosService.update(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Registro actualizado correctamente',
      data: producto,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/productos/:id -> 200 | 400 | 404 | 409
const remove = async (req, res, next) => {
  try {
    const result = await productosService.remove(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Registro eliminado correctamente',
      id: result.producto_id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
