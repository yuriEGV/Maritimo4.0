import express from 'express';
import estudianteController from '../controllers/estudianteController.js';

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

export default router;