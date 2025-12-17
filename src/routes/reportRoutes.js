import express from 'express';
import Report from '../models/reportModel.js';

const router = express.Router();

// Crear reporte
router.post('/', async (req, res, next) => {
    try {
        const report = await Report.create({
            tenantId: req.user.tenantId,
            type: req.body.tipo,
            format: req.body.formato,
            filters: req.body.filtros
        });

        res.status(201).json(report);
    } catch (err) {
        next(err);
    }
});

// 🔹 OBTENER REPORTE POR ID (ESTE FALTABA)
router.get('/:id', async (req, res, next) => {
    try {
        const report = await Report.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId
        });

        if (!report) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }

        res.json(report);
    } catch (err) {
        next(err);
    }
});

export default router;
