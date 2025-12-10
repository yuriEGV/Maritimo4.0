import express from 'express';
import webhookController from '../controllers/webhookController.js';

const router = express.Router();

// Public webhooks
router.post('/mercadolibre', webhookController.mercadoLibreWebhook);
router.post('/flow', webhookController.flowWebhook);
router.post('/webpay', webhookController.webpayWebhook);

export default router;
