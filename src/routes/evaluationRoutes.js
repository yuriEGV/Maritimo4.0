const express = require('express');
const evaluationController = require('../controllers/evaluationController');

const router = express.Router();

// Create a new evaluation
router.post('/', evaluationController.createEvaluation);

// Get all evaluations
router.get('/', evaluationController.getEvaluations);

// Get evaluations by course
router.get('/course/:courseId', evaluationController.getEvaluationsByCourse);

// Get evaluations by tenant
router.get('/tenant/:tenantId', evaluationController.getEvaluationsByTenant);

// Get a single evaluation by ID
router.get('/:id', evaluationController.getEvaluationById);

// Update an evaluation by ID
router.put('/:id', evaluationController.updateEvaluation);

// Delete an evaluation by ID
router.delete('/:id', evaluationController.deleteEvaluation);

module.exports = router;
