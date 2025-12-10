/*import express from 'express';
import tenantScope from '../middleware/tenantScope.js';
import { requestReport, getReports } from '../controllers/reportController.js';

const router = express.Router();

// authMiddleware YA se ejecuta antes en index.js
router.post('/', tenantScope, requestReport);
router.get('/', tenantScope, getReports);

export default router;
*/

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  estudianteId: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'processing' },
  fileUrl: { type: String },
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
