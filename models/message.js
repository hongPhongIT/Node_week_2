import mongoose from 'mongoose';
import Group from '../models/group';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is require'],
    },
    message: {
        type: String,
        max: 255,
        required: [true, 'Message is require'],
    },
    group: {
        type:  Schema.Types.ObjectId,
        ref: 'Group',
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timeStamp: true });

messageSchema.pre('save', async function (next) {
    try {
        const group = await Group.findOne({ _id: this.group }).select('members').lean(true);
        if (!group) {
            return next(new Error('Group is not found'));
        }
        let members = [];
        for (let i = 0; i < group.members.length; i++) {
            members.push(group.members[i].toString());   
        }
        if (!members.includes(this.author.toString())) {
            return next(new Error('This member is not exit in this Group'));
        }
    } catch (e) {
        return next(e);        
    }
});

const Message = mongoose.model('messages', messageSchema);

export default Message;