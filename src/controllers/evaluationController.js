const Evaluation = require('../models/evaluationModel');

class EvaluationController {
    // Create a new evaluation
    static async createEvaluation(req, res) {
        try {
            const evaluation = new Evaluation(req.body);
            await evaluation.save();
            await evaluation.populate('courseId', 'name code');
            res.status(201).json(evaluation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all evaluations
    static async getEvaluations(req, res) {
        try {
            const evaluations = await Evaluation.find()
                .populate('courseId', 'name code');
            res.status(200).json(evaluations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get evaluations by course
    static async getEvaluationsByCourse(req, res) {
        try {
            const evaluations = await Evaluation.find({ courseId: req.params.courseId })
                .populate('courseId', 'name code');
            res.status(200).json(evaluations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get evaluations by tenant
    static async getEvaluationsByTenant(req, res) {
        try {
            const evaluations = await Evaluation.find({ tenantId: req.params.tenantId })
                .populate('courseId', 'name code');
            res.status(200).json(evaluations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single evaluation by ID
    static async getEvaluationById(req, res) {
        try {
            const evaluation = await Evaluation.findById(req.params.id)
                .populate('courseId', 'name code');
            if (!evaluation) {
                return res.status(404).json({ message: 'Evaluación no encontrada' });
            }
            res.status(200).json(evaluation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update an evaluation by ID
    static async updateEvaluation(req, res) {
        try {
            const evaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate('courseId', 'name code');
            if (!evaluation) {
                return res.status(404).json({ message: 'Evaluación no encontrada' });
            }
            res.status(200).json(evaluation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete an evaluation by ID
    static async deleteEvaluation(req, res) {
        try {
            const evaluation = await Evaluation.findByIdAndDelete(req.params.id);
            if (!evaluation) {
                return res.status(404).json({ message: 'Evaluación no encontrada' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = EvaluationController;
