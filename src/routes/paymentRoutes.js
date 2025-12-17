import express from 'express';
import PaymentController from '../controllers/paymentController.js';
import paymentService from '../services/paymentService.js';

const router = express.Router();

/**
 * Pago MANUAL (sin tarifa)
 */
router.post('/manual', PaymentController.createPayment);

/**
 * Pago DESDE TARIFA (automático / proveedor)
 */
router.post('/from-tariff', async (req, res, next) => {
  try {
    const { estudianteId, tariffId, provider, metadata } = req.body || {};
    const tenantId = req.user?.tenantId;

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

/**
 * Listar pagos
 */
router.get('/', async (req, res, next) => {
  try {
    const payments = await paymentService.listPayments({
      tenantId: req.user?.tenantId
    });
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

/**
 * Obtener pago por ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const payment = await paymentService.getPayment(
      req.params.id,
      req.user?.tenantId
    );
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

export default router;
