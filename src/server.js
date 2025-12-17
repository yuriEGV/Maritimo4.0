import 'dotenv/config'; // Importar primero para cargar variables de entorno
import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/index.js';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import os from 'os';
import errorMiddleware from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import reportRoutes from './routes/reportRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import courseRoutes from './routes/courseRoutes.js';



const app = express();

// Middleware
// Capture raw body for webhook signature verification
// Middlewares base
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf && buf.toString(); } }));
app.use(morgan('dev'));

// Rutas protegidas específicas PRIMERO
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/courses', authMiddleware, courseRoutes);

// Rutas generales DESPUÉS
app.use('/api', apiRoutes);

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});

// Middleware de errores SIEMPRE AL FINAL
app.use(errorMiddleware);


// Iniciar servidor solo en local
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      console.log(`✅ MongoDB conectado a: ${mongoose.connection.host}`);

      app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Error conectando a MongoDB:', err.message);
    });
}

export default app;
