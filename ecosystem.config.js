// Configuración de PM2: mantiene la API corriendo en segundo plano
// y la reinicia automáticamente si se cae o si se reinicia la VM.
module.exports = {
  apps: [
    {
      name: 'forja-api',
      script: 'src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
