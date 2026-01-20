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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://maritimo4-0-a1mr.vercel.app',
  'https://maritimo4-0.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origen (como Postman o Server-to-Server)
    if (!origin) return callback(null, true);

    // Permitir localhost y dominios de Vercel por RegExp
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || /\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`Bloqueado por CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // CRITICAL: Share config for preflight

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

    const email = 'yuri@einsmart.cl';
    const password = '123456';
    let user = await User.findOne({ email });

    if (user) {
      user.passwordHash = await bcrypt.hash(password, 10);
      user.role = 'admin';
      user.tenantId = tenant._id;
      await user.save();
      return res.json({ message: 'User yuri@einsmart.cl updated to admin.' });
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        name: 'Admin Einsmart',
        email,
        passwordHash,
        role: 'admin',
        tenantId: tenant._id
      });
      return res.json({ message: 'User yuri@einsmart.cl created as admin.' });
    }
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
