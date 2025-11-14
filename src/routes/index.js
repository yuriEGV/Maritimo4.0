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

// Existing routes
router.use('/auth', authRoutes);
router.use(authMiddleware);
router.use('/estudiantes', estudianteRoutes);
router.use('/reports', reportRoutes);

// New CRUD routes
router.use('/courses', courseRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/grades', gradeRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/users', userRoutes);
router.use('/tenants', tenantRoutes);
router.use('/apoderados', apoderadoRoutes);
router.use('/anotaciones', anotacionRoutes);

module.exports = router;


