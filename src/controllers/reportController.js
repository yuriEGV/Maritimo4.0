const connectDB = require('../config/db');
const Report = require('../models/reportModel');
const { generateSimplePdf } = require('../services/pdfService');
const { saveStreamToFile } = require('../services/storageService');
const { sendMail } = require('../services/emailService');

async function requestReport(req, res) {
    try {
        await connectDB(); //<--- AQUI !!!

        const { type, studentId, email, lines = [] } = req.body;

        const report = await Report.create({
            tenantId: req.user.tenantId,
            studentId,
            type,
            status: 'processing'
        });

        const pdfStream = generateSimplePdf(`Reporte: ${type}`, lines);
        const { url } = await saveStreamToFile(pdfStream, `report-${report._id}.pdf`);

        report.status = 'completed';
        report.fileUrl = url;
        await report.save();

        if (email) {
            await sendMail(email, 'Reporte generado', `Tu reporte está listo: ${url}`);
        }

        return res.status(201).json({ reportId: report._id, url });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getReports(req, res) {
    try {
        await connectDB(); //<--- AQUI TAMBIÉN
        const reports = await Report.find({ tenantId: req.user.tenantId })
                                   .sort({ createdAt: -1 });

        return res.json(reports);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { requestReport, getReports };
