const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Types.ObjectId, ref: 'Tenant', required: true },
    courseId: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    maxScore: { type: Number, required: true },
    date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);


