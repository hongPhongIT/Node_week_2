import { Router } from 'express';
import UserController from '../controllers/user.controller';
const router = new Router();
import user, { login, changePassword } from '../validations/user'
const validate = require('express-validation')
    , http = require('http');
import Authentication from '../middlewares/authentication'

// Get all users
router.get('/users', [ Authentication.auth ], UserController.getAll);
router.get('/users/:id', [ Authentication.auth, validate(user.params) ],UserController.getUser);
router.post('/users', validate(user.body),UserController.addUser);
router.put('/users/:id', [ Authentication.auth, validate(user.params) ],UserController.updateUser);
router.delete('/users/:id', [ Authentication.auth, validate(user.params) ],UserController.deleteUser);
router.post('/login', validate(login),UserController.login);
router.put('/:id/change-password', [ Authentication.auth, validate(changePassword) ], UserController.changePassword);

export default router;