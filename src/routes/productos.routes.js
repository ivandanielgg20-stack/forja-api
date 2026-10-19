const router = require('express').Router();
const ctrl = require('../controllers/productos.controller');

// Base: /api/v1/productos (se monta en app.js)
router.get('/',       ctrl.getAll);    // GET    listado
router.get('/:id',    ctrl.getById);   // GET    por ID
router.post('/',      ctrl.create);    // POST   crear
router.put('/:id',    ctrl.update);    // PUT    actualizar
router.delete('/:id', ctrl.remove);    // DELETE eliminar

module.exports = router;
