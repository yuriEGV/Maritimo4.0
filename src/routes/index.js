const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const estudianteRoutes = require('./estudianteRoutes');
const authRoutes = require('./authRoutes');
const reportRoutes = require('./reportRoutes');
const courseRoutes = require('./courseRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const evaluationRoutes = require('./evaluationRoutes');
const gradeRoutes = require('./gradeRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const userRoutes = require('./userRoutes');
const tenantRoutes = require('./tenantRoutes');
const apoderadoRoutes = require('./apoderadoRoutes');
const anotacionRoutes = require('./anotacionRoutes');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/* ============================================================
   🟦 1) Middleware UNIVERSAL para Vercel:
      Garantiza conexión MongoDB ANTES de cualquier controlador
   ============================================================ */
router.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log("🔌 Conectando a MongoDB desde función serverless...");
    await connectDB();
  }
  return next();
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

module.exports = router;
