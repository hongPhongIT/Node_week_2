import Chat from '../models/chat';

const ChatController = {};

ChatController.getAll = async (req, res) => {
    try {
        await Chat.find().exec((error, chats) => {
            if (error) {
                return res.status(400).json({isSuccess: false, error: e.message});
            } else {
                return res.status(200).json({isSuccess: true, chats: chats});
            }
        });
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e.message});
    }
};

ChatController.getChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        await Chat.findById(chatId).exec((error, _chat) => {
            if (error) {
                return res.status(400).json({error: error.message});
            } else {
                return res.status(200).json({isSuccess: true, chat: _chat});
            }
        });
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
        await Chat.findByIdAndUpdate(chatId, { $set: { name, message }}, (error, chat) => {
            if (error) {
                return res.status(400).json({isSuccess: false, error: error.message});
            } else {
                return res.status(200).json({isSuccess: true, chat: chat});
            }
        });
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e.message});
    }
}

ChatController.removeChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        await Chat.findByIdAndRemove(chatId, (error, chat) => {
            if (error) {
                return res.status(400).json({isSuccess: false, error: e});
            } else {
                return res.status(200).json({isSuccess: true, chat: chat});
            }
        });
    } catch (e) {
        return res.status(400).json({isSuccess: false, error: e});
    }
}

export default ChatController;
