const express = require('express');
const estudianteController = require('../controllers/estudianteController');

const router = express.Router();

// Create a new estudiante
router.post('/', estudianteController.createEstudiante);

// Get all estudiantes
router.get('/', estudianteController.getEstudiantes);

// Get a single estudiante by ID
router.get('/:id', estudianteController.getEstudianteById);

// Update an estudiante by ID
router.put('/:id', estudianteController.updateEstudiante);

// Delete an estudiante by ID
router.delete('/:id', estudianteController.deleteEstudiante);

module.exports = router;