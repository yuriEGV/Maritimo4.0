const express = require('express');
const auth = require('../middleware/authMiddleware');
const tenantScope = require('../middleware/tenantScope');
const { requestReport, getReports } = require('../controllers/reportController');

const router = express.Router();

router.post('/', auth, tenantScope, requestReport);
router.get('/', auth, tenantScope, getReports);

module.exports = router;


