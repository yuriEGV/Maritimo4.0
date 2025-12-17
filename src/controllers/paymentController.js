import Payment from '../models/paymentModel.js';
import Tariff from '../models/tariffModel.js';

class PaymentController {

  static async createPayment(req, res) {
    try {
      const { estudianteId, apoderadoId, tariffId, fechaVencimiento } = req.body;
      const tenantId = req.user.tenantId;

      if (!estudianteId || !tariffId) {
        return res.status(400).json({
          message: 'estudianteId y tariffId son obligatorios'
        });
      }

      const tariff = await Tariff.findOne({ _id: tariffId, tenantId });
      if (!tariff) {
        return res.status(404).json({ message: 'Tarifa no encontrada' });
      }

      const payment = await Payment.create({
        estudianteId,
        apoderadoId,
        tenantId,
        tariffId: tariff._id,
        concepto: tariff.nombre,
        monto: tariff.monto,
        metodoPago: tariff.metodoPago || 'transferencia',
        estado: 'pendiente',
        fechaVencimiento
      });

      res.status(201).json(payment);

    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async listPayments(req, res) {
    const payments = await Payment.find({ tenantId: req.user.tenantId });
    res.json(payments);
  }

  static async getPaymentById(req, res) {
    const payment = await Payment.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json(payment);
  }
}

export default PaymentController;
