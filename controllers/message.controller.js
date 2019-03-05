import Message from '../models/message';
import GroupController from './group.controller';
import { ResponseHandler } from '../helper';

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

MessageController.getMessageByGroup = async (req, res, next = (e) => {
    return Promise.reject(e);
}) => {
    const groupId = req.params.id;
    const { page, limit } = req.query;
    const skip = (parseInt(page) -1) * parseInt(limit);
    try {
        const messages = await Message.find({ group: groupId, deletedAt: null })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: 1 })
        .lean(true);
        if (!messages) {
            return ResponseHandler.returnSuccess(res, { message: 'Start conversation' });
        } else {
            return ResponseHandler.returnSuccess(res,  messages );
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
        await GroupController.updateGroup({
            body: {
                lastMessage: message._id,
            },
            params: {
                id: message.group,
            }
        },
        null,
        next);
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
