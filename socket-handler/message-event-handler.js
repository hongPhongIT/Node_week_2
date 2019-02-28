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
                // const io = require('socket.io')(http);
                console.log(data.group);
                socket.in(data.group).emit('sendingMessage', message);
                return callback(null, message);
            } catch (e) {
                if (callback) {
                    return callback(e);
                }
            }
        });
    }
}