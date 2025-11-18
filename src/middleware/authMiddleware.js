/*const jwt = require('jsonwebtoken');
const tokenStore = require('../utils/tokenStore');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    if (tokenStore.has(token)) {
        return res.status(401).json({ message: 'Token invalidado' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'tu_clave_secreta';
        const payload = jwt.verify(token, secret);
        req.user = payload;
        return next();
    } catch (err) {
        console.error('Error JWT:', err.message);
        return res.status(401).json({ message: 'Token inválido' });
    }
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }
        return next();
    };
}

module.exports = authMiddleware;
module.exports.authorizeRoles = authorizeRoles;

*/

const jwt = require('jsonwebtoken');
const tokenStore = require('../utils/tokenStore');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Si NO hay Authorization o viene "Bearer " vacío → dejar pasar
    if (!authHeader || authHeader === 'Bearer' || authHeader === 'Bearer ') {
        return next();
    }

    // Extraer token
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    // Validar si está invalidado
    if (tokenStore.has(token)) {
        return res.status(401).json({ message: 'Token invalidado' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'tu_clave_secreta';
        const payload = jwt.verify(token, secret);
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

module.exports = authMiddleware;

module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }
        next();
    };
};

