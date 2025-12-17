import Attendance from '../models/attendanceModel.js';

class AttendanceController {

    static async createAttendance(req, res) {
        try {
            const { estudianteId, fecha, estado = 'presente' } = req.body;

            if (!estudianteId || !fecha) {
                return res.status(400).json({
                    message: 'estudianteId y fecha son obligatorios'
                });
            }

            const attendance = await Attendance.create({
                estudianteId,
                fecha,
                estado,
                tenantId: req.user.tenantId,
                registradoPor: req.user.userId
            });

            res.status(201).json(attendance);

        } catch (error) {
            console.error('Attendance error:', error);
            res.status(400).json({ message: error.message });
        }
    }

    static async listAttendances(req, res) {
        try {
            const attendances = await Attendance.find({
                tenantId: req.user.tenantId
            }).sort({ fecha: -1 });

            res.json(attendances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default AttendanceController;
