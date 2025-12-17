import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware, { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ===============================
   USERS (protegido)
================================ */

// Crear usuario (solo admin)
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    UserController.createUser
);

// Obtener usuarios del tenant actual
router.get(
    '/',
    authMiddleware,
    UserController.getUsers
);

// Obtener usuario por ID (del mismo tenant)
router.get(
    '/:id',
    authMiddleware,
    UserController.getUserById
);

// Actualizar usuario (solo admin)
router.put(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    UserController.updateUser
);

// Eliminar usuario (solo admin)
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    UserController.deleteUser
);

export default router;
