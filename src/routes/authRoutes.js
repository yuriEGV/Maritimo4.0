const express = require('express');
const {
    registrar,
    login,
    invalidateToken,
    obtenerPerfil,
    actualizarPerfil
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Registro y autenticación
router.post('/registro', registrar);
router.post('/login', login);

// Gestión de sesión
router.post('/invalidate', authMiddleware, invalidateToken);
router.post('/logout', authMiddleware, invalidateToken);

// Perfil del usuario autenticado
router.get('/perfil', authMiddleware, obtenerPerfil);
router.put('/perfil', authMiddleware, actualizarPerfil);

module.exports = router;


