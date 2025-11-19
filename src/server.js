const express = require('express');
const apiRoutes = require('./routes/index');
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
  // En Vercel
  storageDir = path.join('/tmp', 'storage');
} else {
  // En local
  storageDir = path.join(os.tmpdir(), 'storage');
}

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

app.use('/files', express.static(storageDir));

// ❌ IMPORTANTE:
// Ya NO conectamos a MongoDB aquí cuando estamos en Vercel
// Porque las funciones serverless deben conectarse desde los controllers.
app.get('/debug-env', (req, res) => {
  res.json({
    inVercel: !!process.env.VERCEL,
    MONGO_URI: process.env.MONGO_URI ? 'OK' : 'MISSING',
    MONGODB_URI: process.env.MONGODB_URI ? 'OK' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'undefined',
    ALL: Object.keys(process.env)
  });
});

// Rutas
app.use('/api', apiRoutes);

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});

// Middleware de errores
app.use(errorMiddleware);

// Iniciar servidor solo en local
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  // SOLO conectar a Mongo en local
  const connectDB = require('./config/db');

  (async () => {
    try {
      await connectDB();
      console.log('✅ MongoDB conectado (modo local)');
    } catch (err) {
      console.error('❌ Error conectando a MongoDB:', err.message);
    }
  })();

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;
