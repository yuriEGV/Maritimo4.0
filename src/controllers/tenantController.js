const Tenant = require('../models/tenantModel');

class TenantController {
    // Create a new tenant
    static async createTenant(req, res) {
        try {
            const tenant = new Tenant(req.body);
            await tenant.save();
            res.status(201).json(tenant);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all tenants
    static async getTenants(req, res) {
        try {
            const tenants = await Tenant.find();
            res.status(200).json(tenants);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single tenant by ID
    static async getTenantById(req, res) {
        try {
            const tenant = await Tenant.findById(req.params.id);
            if (!tenant) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }
            res.status(200).json(tenant);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a tenant by ID
    static async updateTenant(req, res) {
        try {
            const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!tenant) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }
            res.status(200).json(tenant);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a tenant by ID
    static async deleteTenant(req, res) {
        try {
            const tenant = await Tenant.findByIdAndDelete(req.params.id);
            if (!tenant) {
                return res.status(404).json({ message: 'Institución no encontrada' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TenantController;
