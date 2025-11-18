const Tenant = require('../models/tenantModel');
const connectDB = require('../config/connectDB');

class TenantController {

    // Create a new tenant
    static async createTenant(req, res) {
        try {
            await connectDB(); // 🔥 NECESARIO

            const { name, domain } = req.body;

            if (!name) {
                return res.status(400).json({
                    message: "El campo 'name' es obligatorio"
                });
            }

            const tenant = new Tenant({
                name,
                domain: domain || null
            });

            await tenant.save();
            return res.status(201).json(tenant);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Get all tenants
    static async getTenants(req, res) {
        try {
            await connectDB(); // 🔥 NECESARIO

            const tenants = await Tenant.find();
            return res.status(200).json(tenants);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Get one tenant
    static async getTenantById(req, res) {
        try {
            await connectDB(); // 🔥 NECESARIO

            const tenant = await Tenant.findById(req.params.id);
            if (!tenant) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }
            return res.status(200).json(tenant);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Update
    static async updateTenant(req, res) {
        try {
            await connectDB(); // 🔥 NECESARIO

            const tenant = await Tenant.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!tenant) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }

            return res.status(200).json(tenant);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Delete
    static async deleteTenant(req, res) {
        try {
            await connectDB(); // 🔥 NECESARIO

            const tenant = await Tenant.findByIdAndDelete(req.params.id);

            if (!tenant) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }

            return res.status(204).send();

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TenantController;
