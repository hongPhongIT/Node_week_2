import Chat from '../models/chat';

const ChatController = {};

ChatController.getAll = async (req, res, next) => {
    try {
        const chats = await Chat.find();
        return res.status(200).json({ isSuccess: true, chats: chats });
    } catch (e) {
        next(e);
    }
};

ChatController.getChat = async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId);
        return res.status(200).json({ isSuccess: true, chat: chat });
    } catch (e) {
        next(e);
    }
};


ChatController.addChat = async (req, res, next) => {
    try {
        const {name, message} = req.body;
        const chat = new Chat({
                name,
                message
        });
        await chat.save();
        return res.status(200).json({ isSuccess: true, chat: chat });
    } catch (e) {
        next(e);
    }
};

ChatController.updateChat = async  (req, res, next) => {
    try {
        const chatId = req.params.id;
        const {name, message } = req.body;
        const chat = await Chat.findByIdAndUpdate(chatId, { $set: { name, message }});
        return res.status(200).json({ isSuccess: true, chat: chat });
    } catch (e) {
        next(e);
    }
}

ChatController.removeChat = async (req, res, next) => {
    try {
        const chatId = req.params.id;
        await Chat.findByIdAndUpdate(chatId, {'isDelete': true});
        return res.status(200).json({ isSuccess: true, message: 'Delete is success' });
    } catch (e) {
        next(e);
    }
}

export default ChatController;
