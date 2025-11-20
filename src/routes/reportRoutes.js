import express from 'express';
import tenantScope from '../middleware/tenantScope.js';
import { requestReport, getReports } from '../controllers/reportController.js';

const router = express.Router();

// 👉 authMiddleware ya se aplica en routes/index.js
router.post('/', tenantScope, requestReport);
router.get('/', tenantScope, getReports);

export default router;
