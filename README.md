# Forja Athletics API

API RESTful del catálogo de productos de **Forja Athletics**, desarrollada con **Node.js + Express** y **MySQL**, y desplegada en una máquina virtual de **Oracle Cloud Infrastructure (OCI)**.

- **URL base:** `http://40.233.4.248/api/v1`
- **Recurso principal:** `productos` (tabla `producto` de la base de datos `forja_athletics`)
- **Formato:** JSON en peticiones y respuestas

---

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js 22 | Entorno de ejecución |
| Express 5 | Framework para las rutas HTTP |
| mysql2 | Conexión a MySQL (pool de conexiones y consultas preparadas) |
| dotenv | Variables de entorno (`.env`) |
| PM2 | Mantiene la API activa en segundo plano en la VM |
| Nginx | Proxy inverso: publica la API en el puerto 80 |
| MySQL 8 | Base de datos `forja_athletics` |

---

## Estructura del proyecto

```
forja-api/
├── src/
│   ├── server.js                      # Arranca el servidor (puerto 3000)
│   ├── app.js                         # Configuración de Express, rutas y middlewares
│   ├── config/
│   │   └── db.js                      # Pool de conexiones a MySQL
│   ├── models/
│   │   └── productos.model.js         # Consultas SQL
│   ├── services/
│   │   ├── productos.service.js       # Lógica de negocio y reglas
│   │   └── validation.service.js      # Validación de datos de entrada
│   ├── controllers/
│   │   └── productos.controller.js    # Respuestas HTTP (código + JSON)
│   ├── routes/
│   │   └── productos.routes.js        # Definición de endpoints
│   └── middlewares/
│       ├── notFound.js                # 404 para rutas inexistentes
│       └── errorHandler.js            # Manejo central de errores
├── sql/app_api.sql                    # Usuario de MySQL con permisos mínimos
├── docs/
│   ├── forja-api.postman_collection.json   # Colección de pruebas (Postman / Thunder Client)
│   └── nginx-api.conf                 # Bloque de configuración de Nginx
├── ecosystem.config.js                # Configuración de PM2
├── .env.example                       # Plantilla de variables de entorno
└── package.json
```

Flujo de una petición:

```
Cliente → Nginx (:80) → Express (:3000) → routes → controller → service → model → MySQL
```

---

## Endpoints

| Método | Ruta | Descripción | Éxito | Errores |
|---|---|---|---|---|
| GET | `/api/v1/productos` | Lista todos los productos | 200 OK | 500 |
| GET | `/api/v1/productos/:id` | Obtiene un producto por su id | 200 OK | 400, 404 |
| POST | `/api/v1/productos` | Crea un producto | 201 Created | 400 |
| PUT | `/api/v1/productos/:id` | Actualiza un producto | 200 OK | 400, 404 |
| DELETE | `/api/v1/productos/:id` | Elimina un producto | 200 OK | 400, 404, 409 |

### Campos de un producto

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `nombre` | string | Sí | 1 a 100 caracteres |
| `descripcion` | string | No | Texto libre |
| `genero` | string | Sí | `hombre`, `mujer` o `unisex` |
| `precio_base` | number | Sí | Mayor o igual a 0 |
| `categoria_id` | integer | Sí | Debe existir en la tabla `categoria` (1 Playeras, 2 Tank tops, 3 Sudaderas, 4 Joggers, 5 Shorts) |
| `activo` | boolean | No | `true` por defecto |

En las respuestas también aparecen `producto_id` y `categoria` (nombre de la categoría).

---

### 1. GET `/api/v1/productos`

**Respuesta 200 OK**
```json
{
  "status": "success",
  "total": 6,
  "data": [
    {
      "producto_id": 1,
      "nombre": "Playera Oversize Core",
      "descripcion": "Playera de algodón pesado con corte oversize",
      "genero": "unisex",
      "precio_base": 399,
      "activo": true,
      "categoria_id": 1,
      "categoria": "Playeras"
    }
  ]
}
```

### 2. GET `/api/v1/productos/:id`

**Respuesta 200 OK**
```json
{
  "status": "success",
  "data": {
    "producto_id": 1,
    "nombre": "Playera Oversize Core",
    "descripcion": "Playera de algodón pesado con corte oversize",
    "genero": "unisex",
    "precio_base": 399,
    "activo": true,
    "categoria_id": 1,
    "categoria": "Playeras"
  }
}
```

**Respuesta 404 Not Found**
```json
{ "status": "error", "message": "Producto con id 99999 no encontrado" }
```

### 3. POST `/api/v1/productos`

Encabezado: `Content-Type: application/json`

**Cuerpo**
```json
{
  "nombre": "Playera Pump Cover",
  "descripcion": "Playera oversize de algodón para entrenamiento",
  "genero": "unisex",
  "precio_base": 449.00,
  "categoria_id": 1,
  "activo": true
}
```

**Respuesta 201 Created**
```json
{
  "status": "success",
  "message": "Registro creado exitosamente",
  "id": 9,
  "data": { "producto_id": 9, "nombre": "Playera Pump Cover", "...": "..." }
}
```

**Respuesta 400 Bad Request**
```json
{
  "status": "error",
  "message": "Datos inválidos",
  "errors": {
    "nombre": "Es obligatorio y debe ser texto",
    "genero": "Es obligatorio y debe ser uno de: hombre, mujer, unisex",
    "precio_base": "No puede ser negativo"
  }
}
```

### 4. PUT `/api/v1/productos/:id`

Se envían **todos** los campos del producto (reemplazo completo).

**Cuerpo**
```json
{
  "nombre": "Playera Pump Cover Pro",
  "descripcion": "Playera oversize de algodón pesado, edición Pro",
  "genero": "hombre",
  "precio_base": 499.00,
  "categoria_id": 1,
  "activo": true
}
```

**Respuesta 200 OK**
```json
{
  "status": "success",
  "message": "Registro actualizado correctamente",
  "data": { "producto_id": 9, "nombre": "Playera Pump Cover Pro", "...": "..." }
}
```

Errores: **400** si los datos son inválidos y **404** si el id no existe.

### 5. DELETE `/api/v1/productos/:id`

**Respuesta 200 OK**
```json
{ "status": "success", "message": "Registro eliminado correctamente", "id": 9 }
```

**Respuesta 404 Not Found**
```json
{ "status": "error", "message": "Producto con id 99999 no encontrado" }
```

**Respuesta 409 Conflict** (el producto tiene ventas y la llave foránea con `RESTRICT` impide borrarlo)
```json
{ "status": "error", "message": "El producto 1 tiene ventas registradas y no puede eliminarse" }
```

---

## Formato de respuestas y códigos HTTP

Todas las respuestas tienen el campo `status` (`success` o `error`).

| Código | Cuándo |
|---|---|
| 200 OK | Consulta, actualización o eliminación correcta |
| 201 Created | Producto creado |
| 400 Bad Request | JSON mal formado, campos inválidos, id no numérico o categoría inexistente |
| 404 Not Found | El producto o la ruta no existen |
| 409 Conflict | Se intenta borrar un producto con ventas registradas |
| 500 Internal Server Error | Error inesperado del servidor o de la base de datos (el detalle solo se registra en el servidor) |

---

## Ejecución local

```bash
npm install
cp .env.example .env      # y editar los datos de conexión
npm run dev               # con nodemon (se reinicia al guardar)
# o
npm start
```

## Pruebas

Importar `docs/forja-api.postman_collection.json` en **Postman** (Import) o en **Thunder Client** (Collections → Import).
La variable `base_url` apunta a `http://40.233.4.248/api/v1`. Ejecutar las peticiones en orden: el POST guarda el id creado y lo usan el PUT y el DELETE. La carpeta "Pruebas de errores" contiene ejemplos de 400, 404 y 409.

## Seguridad

- La API usa el usuario de MySQL `app_api`, que solo tiene CRUD en `producto` y lectura en `categoria`.
- Todas las consultas usan parámetros (`?`), lo que evita la inyección SQL.
- Express escucha solo en `127.0.0.1:3000`; el acceso público pasa por Nginx en el puerto 80.
- Las credenciales están en `.env`, que no se sube al repositorio.

---

Autor: Iván Daniel García García · Optativa de Base de Datos · Universidad Politécnica de Gómez Palacio
