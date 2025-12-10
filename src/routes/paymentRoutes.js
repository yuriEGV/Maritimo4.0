import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', paymentController.createPayment);
router.get('/', paymentController.listPayments);
router.get('/:id', paymentController.getPayment);

export default router;
