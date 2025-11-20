import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, require:false },
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);


