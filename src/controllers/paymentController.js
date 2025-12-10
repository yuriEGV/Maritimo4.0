import { config } from 'dotenv';
config();

import mercadopago from 'mercadopago';
import Payment from '../models/paymentModel.js';
import Tariff from '../models/tariffModel.js';
import Estudiante from '../models/estudianteModel.js';

// Config MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN, // FIX
});

class PaymentService {
  static async createPaymentFromTariff({ tenantId, estudianteId, tariffId, provider, metadata = {} }) {

    // 1) Validar tarifa
    const tarifa = await Tariff.findOne({ _id: tariffId, tenantId });
    if (!tarifa) throw new Error('Tarifa no encontrada');

    // 2) Validar estudiante
    const estudiante = await Estudiante.findOne({ _id: estudianteId });
    if (!estudiante) throw new Error('Estudiante no encontrado');

    // 3) Crear preferencia MercadoPago
    const preference = {
      items: [
        {
          title: tarifa.name,
          quantity: 1,
          currency_id: tarifa.currency || 'CLP',
          unit_price: tarifa.amount,
        },
      ],
      payer: {
        name: estudiante.nombre,
        surname: estudiante.apellido,
        email: metadata?.email || "test_user@test.com", // evitar crash si falta email
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

    const preferenceId =
      response.body?.id || response.id;

    const initPoint =
      response.body?.init_point || response.init_point;

    // 4) Guardar en BD
    const nuevoPago = await Payment.create({
      tenantId,
      estudianteId,
      tariffId,
      amount: tarifa.amount,
      currency: tarifa.currency || "CLP",
      provider,
      providerPaymentId: preferenceId,
      metadata: {
        init_point: initPoint,
        ...metadata
      },
      status: 'pending',
    });

    return {
      message: 'Pago creado',
      init_point: initPoint,
      preference_id: preferenceId,
      pago: nuevoPago,
    };
  }

  static async getPayment(id, tenantId) {
    return Payment.findOne({ _id: id, tenantId });
  }

  static async listPayments(filter) {
    return Payment.find(filter).sort({ createdAt: -1 });
  }
}

export default PaymentService;
