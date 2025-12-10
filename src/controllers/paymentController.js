import paymentService from '../services/paymentService.js';
import Payment from '../models/paymentModel.js';

class PaymentController {
  static async createPayment(req, res) {
    try {
      const { estudianteId, tariffId, provider, metadata } = req.body;
      const tenantId = req.user.tenantId;
      const result = await paymentService.createPaymentFromTariff({ tenantId, estudianteId, tariffId, provider, metadata });
      res.status(201).json(result);
    } catch (error) {
      console.error('Error crear pago:', error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getPayment(req, res) {
    try {
      const payment = await paymentService.getPayment(req.params.id, req.user.tenantId);
      if (!payment) return res.status(404).json({ message: 'Pago no encontrado' });
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async listPayments(req, res) {
    try {
      const filter = { tenantId: req.user.tenantId };
      if (req.query.estudianteId) filter.estudianteId = req.query.estudianteId;
      const payments = await paymentService.listPayments(filter);
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default PaymentController;
