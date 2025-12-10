import Attendance from '../models/attendanceModel.js';

class AttendanceController {
    // Create a new attendance record
    static async createAttendance(req, res) {
        try {
            const attendance = new Attendance(req.body);
            await attendance.save();
            await attendance.populate('estudianteId', 'nombre apellido');
            await attendance.populate('courseId', 'name code');
            res.status(201).json(attendance);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all attendance records
    static async getAttendances(req, res) {
        try {
            const attendances = await Attendance.find()
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(attendances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get attendance by course
    static async getAttendanceByCourse(req, res) {
        try {
            const attendances = await Attendance.find({ courseId: req.params.courseId })
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(attendances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get attendance by student
    static async getAttendanceByStudent(req, res) {
        try {
            const attendances = await Attendance.find({ estudianteId: req.params.estudianteId })
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(attendances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get attendance by date range
    static async getAttendanceByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const query = {};
            
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const attendances = await Attendance.find(query)
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code');
            res.status(200).json(attendances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single attendance record by ID
    static async getAttendanceById(req, res) {
        try {
            const attendance = await Attendance.findById(req.params.id)
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code');
            if (!attendance) {
                return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
            }
            res.status(200).json(attendance);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update an attendance record by ID
    static async updateAttendance(req, res) {
        try {
            const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate('estudianteId', 'nombre apellido')
                .populate('courseId', 'name code');
            if (!attendance) {
                return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
            }
            res.status(200).json(attendance);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete an attendance record by ID
    static async deleteAttendance(req, res) {
        try {
            const attendance = await Attendance.findByIdAndDelete(req.params.id);
            if (!attendance) {
                return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default AttendanceController;
