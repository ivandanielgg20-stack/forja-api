require('dotenv').config();
const app = require('./app');

const PORT = Number(process.env.PORT) || 3000;
// 127.0.0.1: solo escucha dentro de la VM. Nginx recibe las peticiones
// públicas en el puerto 80 y las reenvía aquí (proxy inverso).
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`Forja API escuchando en http://${HOST}:${PORT}/api/v1`);
});
