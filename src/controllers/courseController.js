/*const Course = require('../models/courseModel');

class CourseController {
    // Create a new course
    static async createCourse(req, res) {
        try {
            const course = new Course(req.body);
            await course.save();
            res.status(201).json(course);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all courses
    static async getCourses(req, res) {
        try {
            const courses = await Course.find().populate('teacherId', 'name email');
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get courses by tenant
    static async getCoursesByTenant(req, res) {
        try {
            const courses = await Course.find({ tenantId: req.params.tenantId }).populate('teacherId', 'name email');
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single course by ID
    static async getCourseById(req, res) {
        try {
            const course = await Course.findById(req.params.id).populate('teacherId', 'name email');
            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a course by ID
    static async updateCourse(req, res) {
        try {
            const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('teacherId', 'name email');
            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }
            res.status(200).json(course);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a course by ID
    static async deleteCourse(req, res) {
        try {
            const course = await Course.findByIdAndDelete(req.params.id);
            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CourseController;
*/

const Course = require('../models/courseModel');

class CourseController {
    // Crear un curso
    static async createCourse(req, res) {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'El nombre del curso es obligatorio' });
            }

            const course = new Course({
                name,
                description,
                teacherId: req.user.userId,  // tomado del token JWT
                tenantId: req.user.tenantId  // tomado del token JWT
            });

            await course.save();
            res.status(201).json({
                message: 'Curso creado exitosamente',
                course
            });
        } catch (error) {
            console.error('❌ Error al crear curso:', error);
            res.status(500).json({ message: 'Error al crear curso', error: error.message });
        }
    }

    // Obtener todos los cursos (solo del tenant actual)
    static async getCourses(req, res) {
        try {
            const courses = await Course.find({ tenantId: req.user.tenantId })
                .populate('teacherId', 'name email');

            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Obtener cursos por tenant (solo admin puede consultar otro tenant)
    static async getCoursesByTenant(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'No tienes permisos para ver otros tenants' });
            }

            const courses = await Course.find({ tenantId: req.params.tenantId })
                .populate('teacherId', 'name email');
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Obtener un curso específico
    static async getCourseById(req, res) {
        try {
            const course = await Course.findOne({
                _id: req.params.id,
                tenantId: req.user.tenantId
            }).populate('teacherId', 'name email');

            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }

            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Actualizar curso
    static async updateCourse(req, res) {
        try {
            const course = await Course.findOneAndUpdate(
                { _id: req.params.id, tenantId: req.user.tenantId },
                req.body,
                { new: true }
            ).populate('teacherId', 'name email');

            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado o no pertenece a tu tenant' });
            }

            res.status(200).json(course);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Eliminar curso
    static async deleteCourse(req, res) {
        try {
            const course = await Course.findOneAndDelete({
                _id: req.params.id,
                tenantId: req.user.tenantId
            });

            if (!course) {
                return res.status(404).json({ message: 'Curso no encontrado o no pertenece a tu tenant' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CourseController;
