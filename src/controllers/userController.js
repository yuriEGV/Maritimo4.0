const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserController {
    // Create a new user
    static async createUser(req, res) {
        try {
            const { name, email, password, role, tenantId } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            // Hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const user = new User({
                name,
                email,
                passwordHash,
                role,
                tenantId
            });
            
            await user.save();
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                createdAt: user.createdAt
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all users
    static async getUsers(req, res) {
        try {
            const users = await User.find().select('-passwordHash');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get users by tenant
    static async getUsersByTenant(req, res) {
        try {
            const users = await User.find({ tenantId: req.params.tenantId }).select('-passwordHash');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get users by role
    static async getUsersByRole(req, res) {
        try {
            const users = await User.find({ role: req.params.role }).select('-passwordHash');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single user by ID
    static async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-passwordHash');
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a user by ID
    static async updateUser(req, res) {
        try {
            const updateData = { ...req.body };
            
            // If password is being updated, hash it
            if (updateData.password) {
                const saltRounds = 10;
                updateData.passwordHash = await bcrypt.hash(updateData.password, saltRounds);
                delete updateData.password;
            }

            const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-passwordHash');
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a user by ID
    static async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;
