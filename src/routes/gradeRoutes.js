const express = require('express');
const gradeController = require('../controllers/gradeController');

const router = express.Router();

// Create a new grade
router.post('/', gradeController.createGrade);

// Get all grades
router.get('/', gradeController.getGrades);

// Get grades by student
router.get('/student/:studentId', gradeController.getGradesByStudent);

// Get grades by evaluation
router.get('/evaluation/:evaluationId', gradeController.getGradesByEvaluation);

// Get grades by tenant
router.get('/tenant/:tenantId', gradeController.getGradesByTenant);

// Get a single grade by ID
router.get('/:id', gradeController.getGradeById);

// Update a grade by ID
router.put('/:id', gradeController.updateGrade);

// Delete a grade by ID
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;
