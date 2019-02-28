import GroupEventHandler from './group-event-handler';
import MessageEventHandler from './message-event-handler';
import Authentication from './authentication-handler';

export default class SocketHelper {

    static async initSocket(http) {
        const io = require('socket.io')(http);

        io
        // .use(async function (socket, next) {
        //     Authentication.initAuth(socket, next);
        // })
        .on('connection', async function(socket){
            console.log('user is connected');
            GroupEventHandler.getActiveGroup(socket);
            // socket.on('sendingMessage', function(data) {
            //     console.log('Get data on event sendingMessage');
            //     console.log(data);
            //     socket.to(data.group).emit('sendingMessage', data);
            // });

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