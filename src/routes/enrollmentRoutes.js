import express from 'express';
import enrollmentController from '../controllers/enrollmentController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Create a new enrollment
// Create a new enrollment. Accept multiple files via field `documents`.
router.post('/', upload.array('documents'), enrollmentController.createEnrollment);

// Get all enrollments
router.get('/', enrollmentController.getEnrollments);

// Get enrollments by student (estudiante)
router.get('/estudiante/:estudianteId', enrollmentController.getEnrollmentsByStudent);

// Get enrollments by course
router.get('/course/:courseId', enrollmentController.getEnrollmentsByCourse);

// Get enrollments by tenant
router.get('/tenant/:tenantId', enrollmentController.getEnrollmentsByTenant);

// Get enrollments by period
router.get('/period/:period', enrollmentController.getEnrollmentsByPeriod);

// Get a single enrollment by ID
router.get('/:id', enrollmentController.getEnrollmentById);

// Update an enrollment by ID
router.put('/:id', enrollmentController.updateEnrollment);

// Add documents to an existing enrollment
router.post('/:id/documents', upload.array('documents'), enrollmentController.addDocuments);

// Delete an enrollment by ID
router.delete('/:id', enrollmentController.deleteEnrollment);

export default router;
