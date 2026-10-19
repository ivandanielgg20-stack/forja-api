const pool = require('../config/db');

// Capa de datos: solo ejecuta consultas SQL.
// Todas usan parámetros (?) para evitar inyección SQL.

const SELECT_PRODUCTO = `
  SELECT p.producto_id,
         p.nombre,
         p.descripcion,
         p.genero,
         p.precio_base,
         p.activo,
         p.categoria_id,
         c.nombre AS categoria
  FROM producto p
  INNER JOIN categoria c ON c.categoria_id = p.categoria_id`;

const getAll = () => {
  return pool.query(`${SELECT_PRODUCTO} ORDER BY p.producto_id`);
};

const getById = (id) => {
  return pool.query(`${SELECT_PRODUCTO} WHERE p.producto_id = ?`, [id]);
};

const create = (categoria_id, nombre, descripcion, genero, precio_base, activo) => {
  return pool.query(
    'INSERT INTO producto (categoria_id, nombre, descripcion, genero, precio_base, activo) VALUES (?, ?, ?, ?, ?, ?)',
    [categoria_id, nombre, descripcion, genero, precio_base, activo]
  );
};

const update = (id, categoria_id, nombre, descripcion, genero, precio_base, activo) => {
  return pool.query(
    'UPDATE producto SET categoria_id = ?, nombre = ?, descripcion = ?, genero = ?, precio_base = ?, activo = ? WHERE producto_id = ?',
    [categoria_id, nombre, descripcion, genero, precio_base, activo, id]
  );
};

const remove = (id) => {
  return pool.query('DELETE FROM producto WHERE producto_id = ?', [id]);
};

const existsCategoria = (categoria_id) => {
  return pool.query('SELECT categoria_id FROM categoria WHERE categoria_id = ?', [categoria_id]);
};

module.exports = { getAll, getById, create, update, remove, existsCategoria };
