import Chat from '../models/chat';

const ChatController = {};

ChatController.getAll = async (req, res) => {
    try {
        const chats = await Chat.find();
        return res.status(200).json({isSuccess: true, chats: chats});
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e.message});
    }
};

ChatController.getChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId);
        return res.status(200).json({isSuccess: true, chat: chat});
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e.message});
    }
};


ChatController.addChat = async (req, res) => {
    try {
        const {name, message} = req.body;
        const chat = new Chat({
                name,
                message
        });
        await chat.save();
        return res.status(200).json({isSuccess: true, chat: chat});
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e});
    }
};

ChatController.updateChat = async  (req, res) => {
    try {
        const chatId = req.params.id;
        const {name, message } = req.body;
        const chat = await Chat.findByIdAndUpdate(chatId, { $set: { name, message }});
        return res.status(200).json({isSuccess: true, chat: chat});
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e.message});
    }
}

ChatController.removeChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        await Chat.findByIdAndRemove(chatId);
        return res.status(200).json({isSuccess: true, message: 'Delete is success'});
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e});
    }
}

export default ChatController;
