const productosModel = require('../models/productos.model');
const { parseId, validateProducto } = require('./validation.service');

// Capa de negocio: valida, aplica reglas y decide qué error corresponde.

// Código de MySQL cuando una llave foránea con RESTRICT impide borrar
const ER_ROW_IS_REFERENCED = 1451;

/**
 * MySQL guarda BOOLEAN como TINYINT (0/1); se convierte a true/false para el JSON.
 */
const formatProducto = (row) => {
  return {
    producto_id: row.producto_id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    genero: row.genero,
    precio_base: row.precio_base,
    activo: row.activo === 1,
    categoria_id: row.categoria_id,
    categoria: row.categoria,
  };
};

const getAll = async () => {
  const [rows] = await productosModel.getAll();

  const productos = [];
  for (const row of rows) {
    productos.push(formatProducto(row));
  }

  return productos;
};

const getById = async (idParam) => {
  const id = parseId(idParam);
  const [rows] = await productosModel.getById(id);

  if (rows.length === 0) {
    throw { status: 404, message: `Producto con id ${id} no encontrado` };
  }

  return formatProducto(rows[0]);
};

/**
 * Lanza 400 si la categoría no existe (evita depender del error de llave foránea).
 */
const checkCategoria = async (categoria_id) => {
  const [rows] = await productosModel.existsCategoria(categoria_id);

  if (rows.length === 0) {
    throw {
      status: 400,
      message: 'Datos inválidos',
      errors: { categoria_id: `La categoría ${categoria_id} no existe` },
    };
  }
};

const create = async (body) => {
  const data = validateProducto(body);
  await checkCategoria(data.categoria_id);

  const [result] = await productosModel.create(
    data.categoria_id,
    data.nombre,
    data.descripcion,
    data.genero,
    data.precio_base,
    data.activo
  );

  return getById(result.insertId);
};

const update = async (idParam, body) => {
  const id = parseId(idParam);
  const data = validateProducto(body);

  // Primero se confirma que el producto exista (404 si no)
  const [rows] = await productosModel.getById(id);
  if (rows.length === 0) {
    throw { status: 404, message: `Producto con id ${id} no encontrado` };
  }

  await checkCategoria(data.categoria_id);

  await productosModel.update(
    id,
    data.categoria_id,
    data.nombre,
    data.descripcion,
    data.genero,
    data.precio_base,
    data.activo
  );

  return getById(id);
};

const remove = async (idParam) => {
  const id = parseId(idParam);

  try {
    const [result] = await productosModel.remove(id);

    if (result.affectedRows === 0) {
      throw { status: 404, message: `Producto con id ${id} no encontrado` };
    }
  } catch (err) {
    // El producto tiene variantes que ya aparecen en ventas
    if (err.errno === ER_ROW_IS_REFERENCED) {
      throw {
        status: 409,
        message: `El producto ${id} tiene ventas registradas y no puede eliminarse`,
      };
    }
    throw err;
  }

  return { producto_id: id };
};

module.exports = { getAll, getById, create, update, remove };
