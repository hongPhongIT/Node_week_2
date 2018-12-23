import { Router } from 'express';
import UserController from '../controllers/user.controller';
const router = new Router();

// Get all users
router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getUser);
router.post('/users', UserController.addUser);

export default router;