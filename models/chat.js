import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let chatSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is require'],
        max: 255,
        min: 10
    },
    message: String,
    isDelete: {
        type: Boolean,
        default: false,
    }
});

let Chat = mongoose.model('Chat', chatSchema);

export default Chat;