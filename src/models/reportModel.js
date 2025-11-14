const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Types.ObjectId, ref: 'Tenant', required: true },
    studentId: { type: mongoose.Types.ObjectId, ref: 'Estudiante' },
    type: { type: String, enum: ['grades', 'attendance'], required: true },
    status: { type: String, enum: ['queued', 'processing', 'completed', 'failed'], default: 'queued' },
    fileUrl: { type: String },
    error: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);


