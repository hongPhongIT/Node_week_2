import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let chatSchema = new Schema({
    name: String,
    message: String
});

let Chat = mongoose.model('Chat', chatSchema);

export default Chat;