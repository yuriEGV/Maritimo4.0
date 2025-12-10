import express from 'express';
import tenantController from '../controllers/tenantController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear Tenant — público
router.post('/', tenantController.createTenant);

// Protegidas
router.use(authMiddleware);

router.get('/', tenantController.getTenants);
router.get('/:id', tenantController.getTenantById);
router.put('/:id', tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);

export default router;
