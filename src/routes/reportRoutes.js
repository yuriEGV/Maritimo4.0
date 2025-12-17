/*import express from 'express';
import tenantScope from '../middleware/tenantScope.js';
import { requestReport, getReports } from '../controllers/reportController.js';

const router = express.Router();

// authMiddleware ya se ejecuta antes en index.js
router.post('/', tenantScope, requestReport);
router.get('/', tenantScope, getReports);

export default router;
*/


import express from 'express';
import ReportController from '../controllers/reportController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, ReportController.createReport);

export default router;
