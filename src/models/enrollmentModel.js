const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Types.ObjectId, ref: 'Tenant', required: true },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Estudiante', required: true },
    courseId: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    period: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);


