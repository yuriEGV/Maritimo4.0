const express = require('express');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

// Create a new attendance record
router.post('/', attendanceController.createAttendance);

// Get all attendance records
router.get('/', attendanceController.getAttendances);

// Get attendance by course
router.get('/course/:courseId', attendanceController.getAttendanceByCourse);

// Get attendance by student
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);

// Get attendance by date range
router.get('/date-range', attendanceController.getAttendanceByDateRange);

// Get a single attendance record by ID
router.get('/:id', attendanceController.getAttendanceById);

// Update an attendance record by ID
router.put('/:id', attendanceController.updateAttendance);

// Delete an attendance record by ID
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
