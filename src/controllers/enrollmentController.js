const Enrollment = require('../models/enrollmentModel');

class EnrollmentController {
    // Create a new enrollment
    static async createEnrollment(req, res) {
        try {
            const enrollment = new Enrollment(req.body);
            await enrollment.save();
            await enrollment.populate('studentId', 'nombre apellido');
            await enrollment.populate('courseId', 'name code');
            res.status(201).json(enrollment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all enrollments
    static async getEnrollments(req, res) {
        try {
            const enrollments = await Enrollment.find()
                .populate('studentId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by student
    static async getEnrollmentsByStudent(req, res) {
        try {
            const enrollments = await Enrollment.find({ studentId: req.params.studentId })
                .populate('studentId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by course
    static async getEnrollmentsByCourse(req, res) {
        try {
            const enrollments = await Enrollment.find({ courseId: req.params.courseId })
                .populate('studentId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by tenant
    static async getEnrollmentsByTenant(req, res) {
        try {
            const enrollments = await Enrollment.find({ tenantId: req.params.tenantId })
                .populate('studentId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by period
    static async getEnrollmentsByPeriod(req, res) {
        try {
            const enrollments = await Enrollment.find({ period: req.params.period })
                .populate('studentId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single enrollment by ID
    static async getEnrollmentById(req, res) {
        try {
            const enrollment = await Enrollment.findById(req.params.id)
                .populate('studentId', 'nombre apellido')
                .populate('courseId', 'name code');
            if (!enrollment) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }
            res.status(200).json(enrollment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update an enrollment by ID
    static async updateEnrollment(req, res) {
        try {
            const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate('studentId', 'nombre apellido')
                .populate('courseId', 'name code');
            if (!enrollment) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }
            res.status(200).json(enrollment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete an enrollment by ID
    static async deleteEnrollment(req, res) {
        try {
            const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
            if (!enrollment) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = EnrollmentController;
