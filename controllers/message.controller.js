import Message from '../models/message';
import { ResponseHandler } from '../helper';
import { rejects } from 'assert';

const MessageController = {};


MessageController.getAll = async (req, res, next) => {
    try {
        const messages = await Message.find({ deletedAt: null }).lean(true);
        ResponseHandler.returnSuccess(res, messages);
    } catch (e) {
        return next(e);
    }
};

MessageController.getMessage = async (req, res, next) => {
    const messageId = req.params.id;
    try {
        const message = await Message.findOne({ _id: messageId, deletedAt: null }).lean(true);
        if (!message) {
            ResponseHandler.returnSuccess(res, { message: 'Message is not found' });
        } else {
            ResponseHandler.returnSuccess(res,  message );
        }
    } catch (e) {
        return next(e);
    }

};

MessageController.addMessage = async (req, res, next = (e) => {
    return Promise.rejects(e);
}) => {
    try {
        const message = new Message({
            ...req.body
        });
        delete message._doc.deletedAt;
        await message.save();
        return ResponseHandler.returnSuccess(res,  message );
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
            ResponseHandler.returnSuccess(res, { message: 'Message is not found' });
        } else {
            await Message.update({ _id: messageId }, { '$set': { message } });
            ResponseHandler.returnSuccess(res,  message );
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
            ResponseHandler.returnSuccess(res,  message );
        }
    } catch (e) {
        return next(e);
    }
};

export default MessageController;
