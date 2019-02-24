import  Authentication from '../middlewares/authentication';
import GroupEventHandler from './group-event-handler';
import MessageEventHandler from './message-event-handler';

export default class SocketHelper {

    static async initSocket(http) {
        const io = require('socket.io')(http);

        io.use(async function (socket, next) {
            console.log(socket.id);
            const { token } = socket.handshake.query;
            try {
                await Authentication.auth(
                    {
                        socket,
                        query: {
                            token
                        }
                    },
                    null,
                    next
                );
                return next();
            } catch (e) {
                return next(e);
            }
        })
        .on('connection', async function(socket){
            console.log('user is connected');

            socket.on('sendingMessage', function(data) {
                console.log('Get data on event sendingMessage');
                console.log(data);
                socket.broadcast.emit('sendingMessage', data);
            });

            socket.on('sendingTyping', function(data) {
                console.log('Get data on event sendingTyping');
                console.log(data);
            });

            GroupEventHandler.initEvent(socket);
            MessageEventHandler.initEvent(socket);

            socket.on('disconnect', function() {
                console.log('user disconnected');
            });
        });
    }

}