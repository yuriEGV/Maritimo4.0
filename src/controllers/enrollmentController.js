import Enrollment from '../models/enrollmentModel.js';
import { saveStreamToFile } from '../services/storageService.js';
import { Readable } from 'stream';

class EnrollmentController {
    // Create a new enrollment
    static async createEnrollment(req, res) {
        try {
            const {
                studentId,      // viene del frontend
                courseId,
                period,
                apoderadoId,
                status,
                fee,
                notes
            } = req.body;

            // Validaciones claras
            if (!studentId || !courseId || !period) {
                return res.status(400).json({
                    message: 'studentId, courseId y period son obligatorios'
                });
            }

            // [NUEVO] Verificar morosidad
            const overduePayments = await import('../models/paymentModel.js').then(m => m.default.countDocuments({
                estudianteId: studentId,
                estado: 'vencido'
            }));

            if (overduePayments > 0) {
                const { superKey } = req.body;
                const REQUIRED_KEY = process.env.SUPER_KEY || 'admin123'; // Fallback seguro

                if (superKey !== REQUIRED_KEY) {
                    return res.status(403).json({
                        message: `El estudiante tiene ${overduePayments} pagos vencidos. Se requiere Super Clave para matricular.`,
                        code: 'ARREARS_LOCK'
                    });
                }
            }

            const enrollment = new Enrollment({
                tenantId: req.user.tenantId,   // SIEMPRE desde JWT
                estudianteId: studentId,       // normalización aquí
                courseId,
                period,
                apoderadoId,
                status,
                fee,
                notes
            });

            // Documentos (si vienen)
            if (req.files && req.files.length) {
                for (const file of req.files) {
                    const bufferStream = new Readable();
                    bufferStream.push(file.buffer);
                    bufferStream.push(null);

                    const filename = `enrollment-${Date.now()}-${file.originalname}`;
                    const { url } = await saveStreamToFile(bufferStream, filename);

                    enrollment.documents.push({
                        filename: file.originalname,
                        url,
                        mimeType: file.mimetype,
                        size: file.size
                    });
                }
            }

            await enrollment.save();

            await enrollment.populate('estudianteId', 'nombre apellido');
            await enrollment.populate('courseId', 'name code');
            await enrollment.populate('apoderadoId', 'nombre apellidos');

            res.status(201).json(enrollment);

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


    // Get all enrollments
    static async getEnrollments(req, res) {
        try {
            const enrollments = await Enrollment.find()
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code')
                .populate('apoderadoId', 'nombre apellidos');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by student
    static async getEnrollmentsByStudent(req, res) {
        try {
            const enrollments = await Enrollment.find({ estudianteId: req.params.estudianteId })
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code')
                .populate('apoderadoId', 'nombre apellidos');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by course
    static async getEnrollmentsByCourse(req, res) {
        try {
            const enrollments = await Enrollment.find({ courseId: req.params.courseId })
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code')
                .populate('apoderadoId', 'nombre apellidos');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by tenant
    static async getEnrollmentsByTenant(req, res) {
        try {
            const enrollments = await Enrollment.find({ tenantId: req.params.tenantId })
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code')
                .populate('apoderadoId', 'nombre apellidos');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get enrollments by period
    static async getEnrollmentsByPeriod(req, res) {
        try {
            const enrollments = await Enrollment.find({ period: req.params.period })
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code')
                .populate('apoderadoId', 'nombre apellidos');
            res.status(200).json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single enrollment by ID
    static async getEnrollmentById(req, res) {
        try {
            const enrollment = await Enrollment.findById(req.params.id)
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code')
                .populate('apoderadoId', 'nombre apellidos');
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
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code')
                .populate('apoderadoId', 'nombre apellidos');
            if (!enrollment) {
                return res.status(404).json({ message: 'Inscripción no encontrada' });
            }
            res.status(200).json(enrollment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Add documents to an existing enrollment
    static async addDocuments(req, res) {
        try {
            const enrollment = await Enrollment.findById(req.params.id);
            if (!enrollment) return res.status(404).json({ message: 'Inscripción no encontrada' });

            if (req.files && req.files.length) {
                for (const file of req.files) {
                    const bufferStream = new Readable();
                    bufferStream.push(file.buffer);
                    bufferStream.push(null);

                    const filename = `enrollment-${Date.now()}-${file.originalname}`;
                    const { url } = await saveStreamToFile(bufferStream, filename);

                    enrollment.documents.push({
                        filename: file.originalname,
                        url,
                        mimeType: file.mimetype,
                        size: file.size
                    });
                }
            }

            await enrollment.save();
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

export default EnrollmentController;
