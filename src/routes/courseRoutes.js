const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Create a new course
router.post('/', courseController.createCourse);

// Get all courses
router.get('/', courseController.getCourses);

// Get courses by tenant
router.get('/tenant/:tenantId', courseController.getCoursesByTenant);

// Get a single course by ID
router.get('/:id', courseController.getCourseById);

// Update a course by ID
router.put('/:id', courseController.updateCourse);

// Delete a course by ID
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
