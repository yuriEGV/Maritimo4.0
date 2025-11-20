import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Types.ObjectId, ref: 'Tenant', required: true },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Estudiante', required: true },
    courseId: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    period: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Enrollment', enrollmentSchema);


