const express = require('express');
const apiRoutes = require('./routes/index');
require('dotenv').config();
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const os = require('os');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Storage universal
let storageDir;

if (process.env.VERCEL || process.env.NOW_REGION) {
  storageDir = path.join('/tmp', 'storage');
} else {
  storageDir = path.join(os.tmpdir(), 'storage');
}

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

app.use('/files', express.static(storageDir));

// ✅ SIEMPRE conectar a MongoDB (local y Vercel)
(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
  }
})();

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

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;
