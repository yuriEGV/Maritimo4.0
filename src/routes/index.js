import express from 'express';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

import estudianteRoutes from './estudianteRoutes.js';
import authRoutes from './authRoutes.js';
import reportRoutes from './reportRoutes.js';
import courseRoutes from './courseRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import evaluationRoutes from './evaluationRoutes.js';
import gradeRoutes from './gradeRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import userRoutes from './userRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import apoderadoRoutes from './apoderadoRoutes.js';
import anotacionRoutes from './anotacionRoutes.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/* ============================================================
   🟦 1) Middleware para conectar Mongo SOLO cuando hace falta
      ⚠ SIN await directo → devuelve una promesa a Express
   ============================================================ */
router.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  console.log("🔌 Conectando a MongoDB desde router...");
  connectDB()
    .then(() => next())
    .catch(err => {
      console.error("❌ Error conectando a MongoDB:", err);
      res.status(500).json({ message: "Error de conexión a la base de datos" });
    });
});

/* =============================
   🟩 2) Rutas públicas
   ============================= */
router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);

/* =============================
   🟥 3) Middleware autenticación
   ============================= */
router.use(authMiddleware);

/* =============================
   🟦 4) Rutas privadas
   ============================= */
router.use('/estudiantes', estudianteRoutes);
router.use('/reports', reportRoutes);
router.use('/courses', courseRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/grades', gradeRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/users', userRoutes);
router.use('/apoderados', apoderadoRoutes);
router.use('/anotaciones', anotacionRoutes);

export default router;
