const express = require('express');
const tenantController = require('../controllers/tenantController');

const router = express.Router();

// Create a new tenant
router.post('/', tenantController.createTenant);

// Get all tenants
router.get('/', tenantController.getTenants);

// Get a single tenant by ID
router.get('/:id', tenantController.getTenantById);

// Update a tenant by ID
router.put('/:id', tenantController.updateTenant);

// Delete a tenant by ID
router.delete('/:id', tenantController.deleteTenant);

module.exports = router;
