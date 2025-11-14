const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');

const router = express.Router();

// Create a new enrollment
router.post('/', enrollmentController.createEnrollment);

// Get all enrollments
router.get('/', enrollmentController.getEnrollments);

// Get enrollments by student
router.get('/student/:studentId', enrollmentController.getEnrollmentsByStudent);

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

// Delete an enrollment by ID
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;
