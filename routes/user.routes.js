import { Router } from 'express';
import UserController from '../controllers/user.controller';
const router = new Router();
import user from '../validation/user'
const validate = require('express-validation')
    , http = require('http');

// Get all users
router.get('/users', UserController.getAll);
router.get('/users/:id', validate(user.params),UserController.getUser);
router.post('/users', validate(user),UserController.addUser);
router.put('/users/:id', validate(user.params),UserController.updateUser);
router.delete('/users/:id', validate(user.params),UserController.deleteUser);

export default router;