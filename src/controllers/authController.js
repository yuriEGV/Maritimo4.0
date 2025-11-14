const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const tokenStore = require('../utils/tokenStore');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function buildPayload(user) {
    return {
        userId: user._id,
        tenantId: user.tenantId,
        role: user.role
    };
}

function sanitizeUser(user) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

function generarToken(user) {
    return jwt.sign(buildPayload(user), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function registrar(req, res) {
    try {
        const { name, email, password, role = 'teacher', tenantId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
        }

        if (!tenantId) {
            return res.status(400).json({ message: 'tenantId es obligatorio para registrar usuarios' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            passwordHash,
            role,
            tenantId
        });

        const token = generarToken(user);

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: sanitizeUser(user),
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = generarToken(user);

        return res.json({
            message: 'Inicio de sesión exitoso',
            user: sanitizeUser(user),
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
}

async function obtenerPerfil(req, res) {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({ user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
    }
}

async function actualizarPerfil(req, res) {
    try {
        const updates = {};
        const { name, email, password } = req.body;

        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) {
            updates.passwordHash = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({
            message: 'Perfil actualizado correctamente',
            user: sanitizeUser(user)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
}

function invalidateToken(req, res) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(400).json({ message: 'No se proporcionó token' });
    }

    tokenStore.add(token);

    return res.json({ message: 'Token invalidado correctamente' });
}

module.exports = {
    registrar,
    login,
    invalidateToken,
    obtenerPerfil,
    actualizarPerfil
};


