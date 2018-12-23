import { Router } from 'express';
import ChatController from '../controllers/chat.controller';
const router = new Router();

// get, delete, get by id, update by id

router.get('/chats', ChatController.getAll);
router.get('/chats/:id', ChatController.getChat);
router.post('/chats', ChatController.addChat);
router.put('/chats/:id', ChatController.updateChat);
router.delete('/chats/:id', ChatController.removeChat);

export default router;