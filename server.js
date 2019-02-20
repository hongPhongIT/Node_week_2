import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './db/connect';
import user from './routes/user.routes';
import chat from './routes/chat.routes';
import uploadFile from './routes/upload-file.routers';
import group from './routes/group.routers';
import message from './routes/message.routers';
const path = require('path');


// this is socket io

const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('sendingMessage', function(data) {
        console.log('Get data on event sendingMessage');
        console.log(data);
        socket.broadcast.emit(data);
    });

    socket.on('sendingTyping', function(data) {
        console.log('Get data on event sendingTyping');
        console.log(data);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

server.use(express.static('public'))

connectToDb();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: false
}));

server.use(user);
server.use(chat);
server.use(group);
server.use(message);
server.use(uploadFile);
server.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.use( (err, req, res, next) => {
    return res.status(500).json({
        isSuccess: false,
        message: err.message || 'Have error',
        error: err.stack || err,
    });
});

// server.use('/static', express.static(path.join(__dirname, 'uploads')));

http.listen(3000, () => {
    console.log('Server started at: 3000');
});