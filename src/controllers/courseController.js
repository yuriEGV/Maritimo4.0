// controllers/courseController.js
import Course from '../models/courseModel.js';

export default class CourseController {
    static async createCourse(req, res) {
        try {
            // Logs críticos para debug en Vercel
            console.log('CREATE COURSE BODY:', req.body);
            console.log('CREATE COURSE USER:', req.user);

            const { name, description, teacherId } = req.body;

            // Validación de body
            if (!name || !description || !teacherId) {
                return res.status(400).json({
                    message: 'name, description y teacherId son obligatorios'
                });
            }

            // Validación de autenticación / tenant
            if (!req.user || !req.user.tenantId) {
                return res.status(401).json({
                    message: 'Tenant no encontrado en el token'
                });
            }

            // Crear curso asociado al tenant
            const course = await Course.create({
                name,
                description,
                teacherId,
                tenantId: req.user.tenantId
            });

            return res.status(201).json(course);

        } catch (error) {
            console.error('Error createCourse:', error);

            return res.status(400).json({
                message: 'Error creando el curso',
                error: error.message
            });
        }
    }
}
