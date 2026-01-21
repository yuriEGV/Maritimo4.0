import 'dotenv/config'; // Importar primero para cargar variables de entorno
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from './routes/index.js';
import morgan from 'morgan';
import errorMiddleware from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import reportRoutes from './routes/reportRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

// --- RESILIENT CORS MIDDLEWARE ---
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Dynamic origin matching for Vercel and Localhost
  const isVercel = origin && (origin.endsWith('.vercel.app') || origin.endsWith('.vercel.sh'));
  const isLocal = origin && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'));

  if (isVercel || isLocal) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback for safety during preflight if no origin header (unlikely in browser)
    res.setHeader('Access-Control-Allow-Origin', 'https://maritimo4-0-ko2s.vercel.app');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-tenant-id, X-Requested-With, Accept, X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24h

  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
// ---------------------------------


// Middleware
// Capture raw body for webhook signature verification
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf && buf.toString(); } }));
app.use(morgan('dev'));

// Rutas protegidas específicas PRIMERO
app.use('/api/reports', authMiddleware, reportRoutes);

// Rutas generales DESPUÉS
app.use('/api', apiRoutes);

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});

// Middleware de errores SIEMPRE AL FINAL
app.use(errorMiddleware);

// --- TEMPORARY SETUP ROUTE ---
import User from './models/userModel.js';
import Tenant from './models/tenantModel.js';
import bcrypt from 'bcryptjs';

app.get('/setup-admin', async (req, res) => {
  try {
    await connectDB(); // Ensure DB is connected for Vercel

    let tenant = await Tenant.findOne({ name: 'Einsmart' });
    if (!tenant) {
      tenant = await Tenant.create({
        name: 'Einsmart',
        domain: 'einsmart.cl',
        theme: { primaryColor: '#3b82f6', secondaryColor: '#1e293b' }
      });
    }

    const admins = [
      { name: 'Yuri Admin', email: 'yuri@einsmart.cl', rut: '1-9' },
      { name: 'Vicente Admin', email: 'vicente@einsmart.cl', rut: '2-7' }
    ];

    const results = [];
    for (const admin of admins) {
      const password = '123456';
      const passwordHash = await bcrypt.hash(password, 10);
      let user = await User.findOne({ email: admin.email });

      if (user) {
        user.passwordHash = passwordHash;
        user.role = 'admin';
        user.tenantId = tenant._id;
        await user.save();
        results.push(`${admin.email} updated`);
      } else {
        await User.create({
          name: admin.name,
          email: admin.email,
          passwordHash,
          role: 'admin',
          tenantId: tenant._id,
          rut: admin.rut
        });
        results.push(`${admin.email} created`);
      }
    }
    return res.json({ message: 'Setup complete', details: results });
  } catch (error) {
    console.error("Setup Error:", error);
    return res.status(500).json({ error: error.message || 'Error occurred' });
  }
});
// -----------------------------


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
