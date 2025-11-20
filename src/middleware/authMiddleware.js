import jwt from 'jsonwebtoken';
import * as tokenStore from '../utils/tokenStore.js';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // 🔒 1. Debe existir header y comenzar con "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    // 🔒 2. Extraer token
    const token = authHeader.split(' ')[1];

    if (!token || token.trim() === '') {
        return res.status(401).json({ message: 'Token requerido' });
    }

    // 🔒 3. Revisar si el token está invalidado
    if (tokenStore.has(token)) {
        return res.status(401).json({ message: 'Token invalidado' });
    }

    try {
        // 🔒 4. Validar token
        const secret = process.env.JWT_SECRET || 'tu_clave_secreta';
        const payload = jwt.verify(token, secret);

        // Añadir usuario al request
        req.user = payload;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

export default authMiddleware;

// 🔒 Middleware para roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permisos' });
        }
        next();
    };
};
