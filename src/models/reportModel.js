import express from 'express';
import tenantScope from '../middleware/tenantScope.js';
import { requestReport, getReports } from '../controllers/reportController.js';

const router = express.Router();

// authMiddleware YA se ejecuta antes en index.js
router.post('/', tenantScope, requestReport);
router.get('/', tenantScope, getReports);

export default router;
