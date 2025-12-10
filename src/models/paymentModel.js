import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Types.ObjectId, ref: 'Tenant', required: true },

  estudianteId: { type: mongoose.Types.ObjectId, ref: 'Estudiante', required: true },

  tariffId: { type: mongoose.Types.ObjectId, ref: 'Tariff', required: true },

  amount: { type: Number, required: true },      // viene desde Tariff
  currency: { type: String, default: 'CLP' },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },

  provider: { type: String, default: 'mercadopago' },

  // IDs de MercadoPago
  mp_preference_id: { type: String },   // creado al iniciar pago
  mp_init_point: { type: String },      // URL del checkout
  mp_payment_id: { type: String },      // ID final (actualizado por webhook)

  metadata: { type: Object },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
