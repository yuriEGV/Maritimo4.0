import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Create a new user
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getUsers);

// Get users by tenant
router.get('/tenant/:tenantId', userController.getUsersByTenant);

// Get users by role
router.get('/role/:role', userController.getUsersByRole);

// Get a single user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

export default router;
