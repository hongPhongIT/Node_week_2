import Message from '../models/message';
import { ResponseHandler } from '../helper';

const MessageController = {};


MessageController.getAll = async (req, res, next) => {
    try {
        const messages = await Message.find({ deletedAt: null }).lean(true);
        return res.json({
            isSuccess: true,
            messages,
        });
    } catch (e) {
        return next(e);
    }
};

MessageController.getMessage = async (req, res, next) => {
    const messageId = req.params.id;
    try {
        const message = await Message.findOne({ _id: messageId, deletedAt: null }).lean(true);
        if (!message) {
            return res.status(400).json({ isSuccess: false, message: 'Message is not found' });
        } else {
            return res.status(200).json({ isSuccess: true, message: message });
        }
    } catch (e) {
        return next(e);
    }

};

MessageController.addMessage = async (req, res, next) => {
    try {
        const message = new Message({
            ...req.body
        });
        delete message._doc.deletedAt;
        await message.save();
        return res.json({
            isSuccess: true,
            message: message
        })
    } catch (e) {
        return next(e);
    }
};

MessageController.updateMessage = async (req, res, next) => {
    const messageId = req.params.id;
    try {
        const { message } = req.body;
        const _message = await Message.findOne({ _id: messageId, deletedAt: null }).select('message').lean(true);
        if (!_message) {
            return res.status(400).json({ isSuccess: false, message: 'Message is not found' });
        } else {
            await Message.update({ _id: messageId }, { '$set': { message } });
            return res.status(200).json({ isSuccess: true, message: message });
        }
    } catch (e) {
        return next(e);
    }
};

MessageController.deleteMessage = async (req, res, next) => {
    const messageId = req.params.id;
    try {
        const message = await Message.findOne({ _id: messageId, deletedAt: null }).select('_id deletedAt').lean(true);
        if (!message) {
            return res.status(400).json({ isSuccess: false, message: 'message is not found' });
        } else {
            const date = new Date();
            message.deletedAt = date;
            await Message.update({ _id: messageId }, { '$set': { message } });
            return res.status(200).json({ isSuccess: true, message: message });
        }
    } catch (e) {
        return next(e);
    }
};

export default MessageController;
