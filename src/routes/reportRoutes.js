const express = require('express');
const tenantScope = require('../middleware/tenantScope');
const { requestReport, getReports } = require('../controllers/reportController');

const router = express.Router();

// 👉 authMiddleware ya se aplica en routes/index.js
router.post('/', tenantScope, requestReport);
router.get('/', tenantScope, getReports);

module.exports = router;
