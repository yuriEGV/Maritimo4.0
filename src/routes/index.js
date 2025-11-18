/*const express = require('express');
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

// Rutas públicas (sin token)
router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);   // <-- AHORA ES PÚBLICA

// Middleware global de autenticación
router.use(authMiddleware);

// Rutas que requieren token
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

*/
const express = require('express');
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

// 🔓 rutas públicas
router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);

// 🔐 rutas protegidas
router.use(authMiddleware);

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
