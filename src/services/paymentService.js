import Payment from '../models/paymentModel.js';
import Tariff from '../models/tariffModel.js';
import flowService from './flowService.js';
import mercadoLibreService from './mercadoLibreService.js';
import webpayService from './webpayService.js';

const createPaymentFromTariff = async ({ tenantId, estudianteId, tariffId, provider, metadata }) => {
  const tariff = await Tariff.findById(tariffId);
  if (!tariff) throw new Error('Tariff not found');

  const payment = new Payment({
    tenantId,
    estudianteId,
    tariffId,
    amount: tariff.amount,
    currency: tariff.currency || 'USD',
    provider: provider || null,
    metadata,
  });

  await payment.save();

  // initiate provider checkout if requested
  if (provider === 'flow') {
    const checkout = await flowService.createCheckout(payment);
    if (checkout?.providerPaymentId && !payment.providerPaymentId) {
      payment.providerPaymentId = checkout.providerPaymentId;
      await payment.save();
    }
    return { payment, checkout };
  }

  if (provider === 'mercadolibre') {
    const checkout = await mercadoLibreService.createCheckout(payment);
    if (checkout?.providerPaymentId && !payment.providerPaymentId) {
      payment.providerPaymentId = checkout.providerPaymentId;
      await payment.save();
    }
    return { payment, checkout };
  }

  if (provider === 'webpay') {
    const checkout = await webpayService.createCheckout(payment);
    if (checkout?.providerPaymentId && !payment.providerPaymentId) {
      payment.providerPaymentId = checkout.providerPaymentId;
      await payment.save();
    }
    return { payment, checkout };
  }

  return { payment };
};

const getPayment = async (id, tenantId) => Payment.findOne({ _id: id, tenantId });
const listPayments = async (filter = {}) => Payment.find(filter).sort({ createdAt: -1 });

export default {
  createPaymentFromTariff,
  getPayment,
  listPayments,
};
