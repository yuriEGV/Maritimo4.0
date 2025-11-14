const express = require('express');
const apiRoutes = require('./routes/index');
const dbConfig = require('./config/db');
require('dotenv').config();
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const os = require('os');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Storage compatible con cualquier entorno
let storageDir;

if (process.env.VERCEL || process.env.NOW_REGION) {
  // En Vercel (serverless/producción)
  storageDir = path.join('/tmp', 'storage');
} else {
  // En local (desarrollo)
  storageDir = path.join(os.tmpdir(), 'storage');
}

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}
app.use('/files', express.static(storageDir));

// Conexión a MongoDB (solo si no está ya conectada)
(async () => {
  try {
    await dbConfig();
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
  }
})();

// Rutas
app.use('/api', apiRoutes);

// Endpoint raíz para comprobar funcionamiento
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});

// Middleware de errores
app.use(errorMiddleware);
console.log('Servidor ejecutándose en http://localhost:5000');
// Iniciar servidor solo en local
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

// Export para Vercel
module.exports = app;
