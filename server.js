import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './db/connect';
import user from './routes/user.routes';
import chat from './routes/chat.routes';
import uploadFile from './routes/upload-file.routers';
import group from './routes/group.routers';
import message from './routes/message.routers';
const path = require('path');

const server = express();

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

server.use( (err, req, res, next) => {
    return res.status(500).json({
        isSuccess: false,
        message: err.message || 'Have error',
        error: err.stack || err,
    });
});

server.use('/static', express.static(path.join(__dirname, 'uploads')));

server.listen(3000, () => {
    console.log('Server started at: 3000');
});

