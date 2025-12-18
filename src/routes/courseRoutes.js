import express from 'express';
import CourseController from '../controllers/courseController.js';

const router = express.Router();

// Create a new course
router.post('/', CourseController.createCourse);

// Get all courses
router.get('/', CourseController.getCourses);

// Get courses by tenant
router.get('/tenant/:tenantId', CourseController.getCoursesByTenant);

// Get a single course by ID
router.get('/:id', CourseController.getCourseById);

// Update a course by ID
router.put('/:id', CourseController.updateCourse);

// Delete a course by ID
router.delete('/:id', CourseController.deleteCourse);

export default router;
