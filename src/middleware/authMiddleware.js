import jwt from 'jsonwebtoken';
import * as tokenStore from '../utils/tokenStore.js';

function authMiddleware(req, res, next) {
    let token = null;

    // 1. Intentar obtener desde Header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // 2. Si no hay token válido en header (o es 'null'), intentar desde Cookies
    if ((!token || token === 'null') && req.headers.cookie) {
        const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = value;
            return acc;
        }, {});

        if (cookies.token) {
            token = cookies.token;
        }
    }

    // 🔒 Validación final: Debe existir un token
    if (!token || token.trim() === '' || token === 'null') {
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
