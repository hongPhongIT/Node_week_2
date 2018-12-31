import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let groupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is require'],
        max: [255, 'Name too long'],
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'chats',
        required: [true, 'Last message is require'],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Author is require'],
    },
    members: [{
        type:  Schema.Types.ObjectId,
    }],
    deleteAt: {
        type: String,
        default: '',
    }
});

let Group = mongoose.model('groups', groupSchema);

export default Group;