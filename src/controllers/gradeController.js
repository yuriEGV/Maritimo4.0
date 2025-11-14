const Grade = require('../models/gradeModel');

class GradeController {
    // Create a new grade
    static async createGrade(req, res) {
        try {
            const grade = new Grade(req.body);
            await grade.save();
            await grade.populate('studentId', 'nombre apellido');
            await grade.populate('evaluationId', 'title maxScore');
            res.status(201).json(grade);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all grades
    static async getGrades(req, res) {
        try {
            const grades = await Grade.find()
                .populate('studentId', 'nombre apellido')
                .populate('evaluationId', 'title maxScore');
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get grades by student
    static async getGradesByStudent(req, res) {
        try {
            const grades = await Grade.find({ studentId: req.params.studentId })
                .populate('studentId', 'nombre apellido')
                .populate('evaluationId', 'title maxScore');
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get grades by evaluation
    static async getGradesByEvaluation(req, res) {
        try {
            const grades = await Grade.find({ evaluationId: req.params.evaluationId })
                .populate('studentId', 'nombre apellido')
                .populate('evaluationId', 'title maxScore');
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get grades by tenant
    static async getGradesByTenant(req, res) {
        try {
            const grades = await Grade.find({ tenantId: req.params.tenantId })
                .populate('studentId', 'nombre apellido')
                .populate('evaluationId', 'title maxScore');
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single grade by ID
    static async getGradeById(req, res) {
        try {
            const grade = await Grade.findById(req.params.id)
                .populate('studentId', 'nombre apellido')
                .populate('evaluationId', 'title maxScore');
            if (!grade) {
                return res.status(404).json({ message: 'Calificación no encontrada' });
            }
            res.status(200).json(grade);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a grade by ID
    static async updateGrade(req, res) {
        try {
            const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate('studentId', 'nombre apellido')
                .populate('evaluationId', 'title maxScore');
            if (!grade) {
                return res.status(404).json({ message: 'Calificación no encontrada' });
            }
            res.status(200).json(grade);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a grade by ID
    static async deleteGrade(req, res) {
        try {
            const grade = await Grade.findByIdAndDelete(req.params.id);
            if (!grade) {
                return res.status(404).json({ message: 'Calificación no encontrada' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = GradeController;
