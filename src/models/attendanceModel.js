import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Types.ObjectId, ref: 'Tenant', required: true },
    courseId: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    estudianteId: { type: mongoose.Types.ObjectId, ref: 'Estudiante', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);


