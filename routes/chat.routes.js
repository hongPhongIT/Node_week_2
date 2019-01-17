import { Router } from 'express';
import ChatController from '../controllers/chat.controller';
import chat from '../validations/chat';
const router = new Router();
const validate = require('express-validation')
    , http = require('http');

// get, delete, get by id, update by id

router.get('/chats', ChatController.getAll);
router.get('/chats/:id', ChatController.getChat);
router.post('/chats', validate(chat), ChatController.addChat);
router.put('/chats/:id', ChatController.updateChat);
router.delete('/chats/:id', ChatController.removeChat);

export default router;