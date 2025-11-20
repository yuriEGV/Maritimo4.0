import connectDB from '../config/db.js';
import Report from '../models/reportModel.js';
import { generateSimplePdf } from '../services/pdfService.js';
import { saveStreamToFile } from '../services/storageService.js';
import { sendMail } from '../services/emailService.js';

// ========================================================
//    CREAR REPORTE
// ========================================================
async function requestReport(req, res) {
    try {
        console.log("📌 [reports] Iniciando handler");

        // Conectar a MongoDB (persistente en Vercel)
        await connectDB();
        console.log("📌 [reports] Mongo conectado correctamente");

        const { type, studentId, email, lines = [] } = req.body;
        console.log("📌 [reports] Body recibido:", req.body);
        console.log("📌 [reports] User info:", req.user);

        if (!req.user || !req.user.tenantId) {
            return res.status(400).json({ message: "Usuario inválido o tenantId faltante" });
        }

        // Crear registro en Mongo
        const report = await Report.create({
            tenantId: req.user.tenantId,
            studentId,
            type,
            status: 'processing'
        });
        console.log("📌 [reports] Report creado en Mongo con ID:", report._id);

        // Generar PDF
        const pdfStream = generateSimplePdf(`Reporte: ${type}`, lines);
        console.log("📌 [reports] PDF generado correctamente");

        // Guardar PDF en storage
        const { url } = await saveStreamToFile(pdfStream, `report-${report._id}.pdf`);
        console.log("📌 [reports] PDF guardado en:", url);

        // Actualizar estado del reporte
        report.status = 'completed';
        report.fileUrl = url;
        await report.save();

        // Enviar correo opcional
        if (email) {
            try {
                console.log("📌 [reports] Enviando email a:", email);
                await sendMail(email, 'Reporte generado', `Tu reporte está listo: ${url}`);
                console.log("📧 Email enviado correctamente a:", email);
            } catch (emailError) {
                console.error("❌ ERROR enviando email, pero reporte generado:", emailError);
            }
        }

        return res.status(201).json({ reportId: report._id, url });

    } catch (err) {
        console.error("❌ ERROR REAL EN REPORTES:", err);
        return res.status(500).json({ message: err.message, stack: err.stack });
    }
}

// ========================================================
//    OBTENER REPORTES
// ========================================================
async function getReports(req, res) {
    try {
        await connectDB();

        if (!req.user || !req.user.tenantId) {
            return res.status(400).json({ message: "Usuario inválido o tenantId faltante" });
        }

        const reports = await Report.find({ tenantId: req.user.tenantId })
            .sort({ createdAt: -1 });

        return res.json(reports);

    } catch (err) {
        console.error("❌ ERROR en GET /reports:", err);
        res.status(500).json({ message: err.message, stack: err.stack });
    }
}

export { requestReport, getReports };
