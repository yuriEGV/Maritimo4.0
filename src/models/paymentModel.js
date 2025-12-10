import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Types.ObjectId, ref: 'Tenant', required: true },
  estudianteId: { type: mongoose.Types.ObjectId, ref: 'Estudiante' },
  tariffId: { type: mongoose.Types.ObjectId, ref: 'Tariff' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'pending' },
  provider: { type: String },
  providerPaymentId: { type: String },
  metadata: { type: Object },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
