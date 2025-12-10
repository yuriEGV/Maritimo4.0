import express from 'express';
import paymentService from '../services/paymentService.js';

const router = express.Router();

// Create payment from a tariff and optional provider checkout
router.post('/', async (req, res, next) => {
  try {
    const { estudianteId, tariffId, provider, metadata } = req.body || {};
    const tenantId = req.user?.tenantId || req.body?.tenantId;

    const result = await paymentService.createPaymentFromTariff({
      tenantId,
      estudianteId,
      tariffId,
      provider,
      metadata
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// List payments for tenant
router.get('/', async (req, res, next) => {
  try {
    const payments = await paymentService.listPayments({ tenantId: req.user?.tenantId });
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

// Get single payment
router.get('/:id', async (req, res, next) => {
  try {
    const payment = await paymentService.getPayment(req.params.id, req.user?.tenantId);
    if (!payment) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

export default router;
