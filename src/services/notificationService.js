import { sendEmail } from './emailService.js';
import Apoderado from '../models/apoderadoModel.js';
import Estudiante from '../models/estudianteModel.js';

class NotificationService {
    /**
     * Send notification to guardians when a grade is posted
     */
    static async notifyNewGrade(studentId, grade, subject, evaluationTitle, tenantId) {
        try {
            const student = await Estudiante.findById(studentId);
            const guardians = await Apoderado.find({ estudianteId: studentId, tenantId });

            if (!student || guardians.length === 0) return;

            for (const guardian of guardians) {
                if (!guardian.correo) continue;

                const html = `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #11355a;">Nueva Calificación</h2>
                        <p>Estimado(a) <strong>${guardian.nombre} ${guardian.apellidos}</strong>,</p>
                        <p>Le informamos que se ha registrado una nueva calificación para el alumno <strong>${student.nombres} ${student.apellidos}</strong>.</p>
                        <div style="background-color: #f4f7f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Asignatura:</strong> ${subject}</p>
                            <p><strong>Evaluación:</strong> ${evaluationTitle}</p>
                            <p style="font-size: 1.2em; color: #11355a;"><strong>Nota: ${grade}</strong></p>
                        </div>
                        <p>Puede ver más detalles ingresando al sistema.</p>
                        <p style="margin-top: 20px; font-size: 12px; color: #777;">Maritimo 4.0 - Sistema de Gestión Escolar</p>
                    </div>
                `;

                await sendEmail(guardian.correo, `Nueva Nota: ${student.nombres} - ${subject}`, html);
            }
        } catch (error) {
            console.error('❌ Error in notifyNewGrade:', error);
        }
    }

    /**
     * Send notification to guardians when an annotation is posted
     */
    static async notifyNewAnnotation(studentId, type, title, description, tenantId) {
        try {
            const student = await Estudiante.findById(studentId);
            const guardians = await Apoderado.find({ estudianteId: studentId, tenantId });

            if (!student || guardians.length === 0) return;

            const typeLabel = type === 'positiva' ? 'Positiva' : 'Negativa';
            const typeColor = type === 'positiva' ? '#22c55e' : '#ef4444';

            for (const guardian of guardians) {
                if (!guardian.correo) continue;

                const html = `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: ${typeColor};">Nueva Anotación ${typeLabel}</h2>
                        <p>Estimado(a) <strong>${guardian.nombre} ${guardian.apellidos}</strong>,</p>
                        <p>Se ha registrado una nueva anotación en la hoja de vida de <strong>${student.nombres} ${student.apellidos}</strong>.</p>
                        <div style="background-color: #f4f7f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Título:</strong> ${title}</p>
                            <p><strong>Descripción:</strong> ${description}</p>
                        </div>
                        <p>Por favor, ingrese al sistema para revisar los detalles y medidas tomadas.</p>
                        <p style="margin-top: 20px; font-size: 12px; color: #777;">Maritimo 4.0 - Sistema de Gestión Escolar</p>
                    </div>
                `;

                await sendEmail(guardian.correo, `Anotación ${typeLabel}: ${student.nombres}`, html);
            }
        } catch (error) {
            console.error('❌ Error in notifyNewAnnotation:', error);
        }
    }
}

export default NotificationService;
