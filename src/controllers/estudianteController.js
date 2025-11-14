const Estudiante = require('../models/estudianteModel');

// Controller for handling student-related operations
class EstudianteController {
    // Create a new student
    static async createEstudiante(req, res) {
        try {
            const estudiante = new Estudiante(req.body);
            await estudiante.save();
            res.status(201).json(estudiante);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all students
    static async getEstudiantes(req, res) {
        try {
            const estudiantes = await Estudiante.find();
            res.status(200).json(estudiantes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single student by ID
    static async getEstudianteById(req, res) {
        try {
            const estudiante = await Estudiante.findById(req.params.id);
            if (!estudiante) {
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
            res.status(200).json(estudiante);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a student by ID
    static async updateEstudiante(req, res) {
        try {
            const estudiante = await Estudiante.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!estudiante) {
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
            res.status(200).json(estudiante);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a student by ID
    static async deleteEstudiante(req, res) {
        try {
            const estudiante = await Estudiante.findByIdAndDelete(req.params.id);
            if (!estudiante) {
                return res.status(404).json({ message: 'Estudiante no encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = EstudianteController;