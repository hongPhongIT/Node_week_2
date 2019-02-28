import { Router } from 'express';
import MessageController from '../controllers/message.controller';
const router = new Router();
import { body, params } from '../validations/message'
const validate = require('express-validation')
    , http = require('http');
import Authentication from '../middlewares/authentication'

// Get all users
router.get('/messages', [ ], MessageController.getAll);
router.get('/messages/:id', [  validate(params) ],MessageController.getMessage);
router.get('/messages/:id/group', [  validate(params) ],MessageController.getMessageByGroup);
router.post('/messages', validate(body),MessageController.addMessage);
router.put('/messages/:id', [  validate(params) ],MessageController.updateMessage);
router.delete('/messages/:id', [  validate(params) ],MessageController.deleteMessage);

export default router;