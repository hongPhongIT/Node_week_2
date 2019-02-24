import MessageController from '../controllers/message.controller';

export default class MessageEventHandler {
    static initEvent(socket) {
        socket.on('creatingMessage', async function(data, callback) {
            // Validation.
            // Call to controller.
            try {
                const message = await MessageController.addMessage({
                    user: socket.user,
                    body: data
                });
                return callback(null, message);
            } catch (e) {
                console.log(e);
                if (callback) {
                    return callback(e);
                }
            }
        });
    }
}