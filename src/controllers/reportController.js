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

        // ⭐ Conexión eficiente para Vercel (persistente global)
        await connectDB();
        console.log("📌 [reports] Mongo conectado correctamente");

        const { type, studentId, email, lines = [] } = req.body;
        console.log("📌 [reports] Body recibido:", req.body);

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

        // Guardar en storage
        const { url } = await saveStreamToFile(pdfStream, `report-${report._id}.pdf`);
        console.log("📌 [reports] PDF guardado en:", url);

        // Actualizar estado
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
                // No interrumpimos el flujo si falla el correo
            }
        }

        return res.status(201).json({ reportId: report._id, url });

    } catch (err) {
        console.error("❌ ERROR REAL EN REPORTES:", err);
        return res.status(500).json({ message: err.message });
    }
}

// ========================================================
//    OBTENER REPORTES
// ========================================================
async function getReports(req, res) {
    try {
        await connectDB();

        const reports = await Report.find({ tenantId: req.user.tenantId })
            .sort({ createdAt: -1 });

        return res.json(reports);

    } catch (err) {
        console.error("❌ ERROR en GET /reports:", err);
        res.status(500).json({ message: err.message });
    }
}

export { requestReport, getReports };
