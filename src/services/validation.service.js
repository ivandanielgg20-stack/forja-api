// Validaciones reutilizables. Cuando algo es inválido se lanza un objeto
// { status, message, errors } que el errorHandler convierte en respuesta JSON.

const GENEROS = ['hombre', 'mujer', 'unisex'];

/**
 * Valida que el id de la URL sea un entero positivo.
 * Ejemplo válido: "5". Inválidos: "abc", "-1", "2.5".
 */
const parseId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw { status: 400, message: 'El id debe ser un número entero positivo' };
  }

  return id;
};

/**
 * Revisa que el cuerpo de la petición sea un objeto JSON.
 */
const requireBody = (body) => {
  if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw { status: 400, message: 'El cuerpo de la petición debe ser un objeto JSON (Content-Type: application/json)' };
  }
};

/**
 * Valida los campos de un producto (se usa en POST y PUT).
 * Devuelve los datos ya limpios y con su tipo correcto.
 */
const validateProducto = (body) => {
  requireBody(body);

  const errors = {};

  // nombre: obligatorio, texto de 1 a 100 caracteres
  let nombre = body.nombre;
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errors.nombre = 'Es obligatorio y debe ser texto';
  } else if (nombre.trim().length > 100) {
    errors.nombre = 'No puede tener más de 100 caracteres';
  } else {
    nombre = nombre.trim();
  }

  // descripcion: opcional, texto
  let descripcion = null;
  if (body.descripcion !== undefined && body.descripcion !== null) {
    if (typeof body.descripcion !== 'string') {
      errors.descripcion = 'Debe ser texto';
    } else {
      descripcion = body.descripcion.trim();
    }
  }

  // genero: obligatorio, uno de los valores del ENUM
  const genero = body.genero;
  if (!GENEROS.includes(genero)) {
    errors.genero = `Es obligatorio y debe ser uno de: ${GENEROS.join(', ')}`;
  }

  // precio_base: obligatorio, número >= 0 con máximo 2 decimales
  const precio_base = Number(body.precio_base);
  if (body.precio_base === undefined || body.precio_base === null || body.precio_base === '' || Number.isNaN(precio_base)) {
    errors.precio_base = 'Es obligatorio y debe ser un número';
  } else if (precio_base < 0) {
    errors.precio_base = 'No puede ser negativo';
  } else if (precio_base > 99999999.99) {
    errors.precio_base = 'Es demasiado grande';
  }

  // categoria_id: obligatorio, entero positivo (su existencia se valida en el service)
  const categoria_id = Number(body.categoria_id);
  if (!Number.isInteger(categoria_id) || categoria_id <= 0) {
    errors.categoria_id = 'Es obligatorio y debe ser un número entero positivo';
  }

  // activo: opcional, booleano (por defecto true)
  let activo = true;
  if (body.activo !== undefined) {
    if (typeof body.activo !== 'boolean') {
      errors.activo = 'Debe ser true o false';
    } else {
      activo = body.activo;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw { status: 400, message: 'Datos inválidos', errors };
  }

  return {
    nombre,
    descripcion,
    genero,
    precio_base: Math.round(precio_base * 100) / 100,
    categoria_id,
    activo,
  };
};

module.exports = { parseId, requireBody, validateProducto, GENEROS };
