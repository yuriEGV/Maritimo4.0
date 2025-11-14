const express = require('express');
const apoderadoController = require('../controllers/apoderadoController');

const router = express.Router();

// Create a new apoderado
router.post('/', apoderadoController.createApoderado);

// Get all apoderados
router.get('/', apoderadoController.getApoderados);

// Get apoderados by estudiante
router.get('/estudiante/:estudianteId', apoderadoController.getApoderadosByEstudiante);

// Get a single apoderado by ID
router.get('/:id', apoderadoController.getApoderadoById);

// Update an apoderado by ID
router.put('/:id', apoderadoController.updateApoderado);

// Delete an apoderado by ID
router.delete('/:id', apoderadoController.deleteApoderado);

module.exports = router;

