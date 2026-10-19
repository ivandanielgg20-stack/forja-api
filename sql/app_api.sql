-- =====================================================================
--  Forja API - Usuario de MySQL para la API REST (Node.js + Express)
--  NO modifica tablas ni datos; solo crea un usuario con permisos mínimos.
--
--  La contraseña NO se guarda en el repositorio: se reemplaza CAMBIAR_PASSWORD
--  al momento de ejecutarlo.
--
--  Ejecución en la VM:
--      sed "s/CAMBIAR_PASSWORD/TuContraseña/" sql/app_api.sql | sudo mysql
-- =====================================================================

DROP USER IF EXISTS 'app_api'@'localhost';

-- Solo puede conectarse desde la propia VM (la API corre en la misma máquina)
CREATE USER 'app_api'@'localhost' IDENTIFIED BY 'CAMBIAR_PASSWORD';

-- Recurso principal de la API: CRUD completo
GRANT SELECT, INSERT, UPDATE, DELETE ON forja_athletics.producto TO 'app_api'@'localhost';

-- Lectura de categorías: para validar categoria_id y mostrar su nombre (JOIN)
GRANT SELECT ON forja_athletics.categoria TO 'app_api'@'localhost';

FLUSH PRIVILEGES;

-- Verificación
SHOW GRANTS FOR 'app_api'@'localhost';
