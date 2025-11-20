const jwt = require('jsonwebtoken');
const tokenStore = require('../utils/tokenStore');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Si NO viene Authorization → bloquear
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

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
            return res.status(403).json({ message: 'No tienes permisos' });
        }
        next();
    };
};
