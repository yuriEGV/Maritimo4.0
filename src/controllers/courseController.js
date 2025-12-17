import Course from '../models/courseModel.js';

class CourseController {

    static async createCourse(req, res) {
        try {
            const { name, description, teacherId } = req.body;

            if (!name || !teacherId) {
                return res.status(400).json({
                    message: 'name y teacherId son obligatorios'
                });
            }

            const course = await Course.create({
                name,
                description,
                teacherId,
                tenantId: req.user.tenantId
            });

            res.status(201).json(course);

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


}

export default CourseController;
