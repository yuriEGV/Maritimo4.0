/*import paymentService from '../services/paymentService.js';
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

export default PaymentController;*/
import mercadopago from 'mercadopago';
import Payment from '../models/paymentModel.js';
import Tariff from '../models/tariffModel.js';
import Estudiante from '../models/estudianteModel.js';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

class PaymentService {
  /**
   * Crear pago basado en una tarifa
   */
  static async createPaymentFromTariff({ tenantId, estudianteId, tariffId, provider, metadata = {} }) {
    // 1) Validación
    const tarifa = await Tariff.findOne({ _id: tariffId, tenantId });
    if (!tarifa) throw new Error('Tarifa no encontrada');

    const estudiante = await Estudiante.findOne({ _id: estudianteId, tenantId });
    if (!estudiante) throw new Error('Estudiante no encontrado');

    // 2) Crear preferencia MercadoPago
    const preference = {
      items: [
        {
          title: tarifa.nombre,
          quantity: 1,
          currency_id: 'CLP',
          unit_price: tarifa.valor,
        },
      ],
      payer: {
        name: estudiante.nombres,
        surname: estudiante.apellidos,
        email: estudiante.email,
      },
      back_urls: {
        success: process.env.MP_SUCCESS_URL,
        pending: process.env.MP_PENDING_URL,
        failure: process.env.MP_FAILURE_URL,
      },
      auto_return: "approved",
      metadata: {
        tenantId,
        estudianteId,
        tariffId,
        ...metadata,
      },
    };

    const response = await mercadopago.preferences.create(preference);

    // 3) Registrar el pago en tu base de datos
    const nuevoPago = await Payment.create({
      tenantId,
      estudianteId,
      tariffId,
      provider,
      mp_preference_id: response.body.id,
      mp_init_point: response.body.init_point,
      metadata,
      status: 'pending',
    });

    return {
      message: 'Pago creado',
      init_point: response.body.init_point,
      preference_id: response.body.id,
      pago: nuevoPago,
    };
  }

  /**
   * Get payment por ID
   */
  static async getPayment(id, tenantId) {
    return Payment.findOne({ _id: id, tenantId });
  }

  /**
   * Listar pagos por filtros
   */
  static async listPayments(filter) {
    return Payment.find(filter).sort({ createdAt: -1 });
  }
}

export default PaymentService;

