/*const express = require('express');
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

module.exports = router;*/



import express from 'express';
import tenantController from '../controllers/tenantController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * RUTA PÚBLICA
 * Crear Tenant NO necesita autenticación (para registrar colegios)
 */
router.post('/', tenantController.createTenant);

/**
 * RUTAS PROTEGIDAS
 * Solo accesibles con token
 */
router.use(authMiddleware);

// Get all tenants
router.get('/', tenantController.getTenants);

// Get a single tenant by ID
router.get('/:id', tenantController.getTenantById);

// Update a tenant by ID
router.put('/:id', tenantController.updateTenant);

// Delete a tenant by ID
router.delete('/:id', tenantController.deleteTenant);

export default router;
