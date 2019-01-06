import mongoose from 'mongoose';
import User from "./user";
import index from "../config";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
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
        default: null,
    }
});
// arrow function => override this variable
groupSchema.pre('save', async function (next) {
    try {
        const users = await User.find({_id:  { "$in": this.members}});
        const user = await User.findById({_id: this.author });
        if (users.length !== this.members.length) {
            const err = new Error('Member is not found');
            return next(err);
        }
        if (user.length === 0) {
            const err = new Error('Member is not found');
            return next(err);
        }
    } catch (e) {
        return next(e);
    }
});

groupSchema.pre('update', async function (next) {
    try {
        const members = this._update._group.members;
        let _members = deduplicate(members);
        const users = await User.find({_id:  { "$in": _members}});
        const user = await User.findById({_id: this._update._group.author });
        if (users.length !== _members) {
            const err = new Error('Member is not found');
            return next(err);
        }
        if (user.length === 0) {
            const err = new Error('Member is not found');
            return next(err);
        }
    } catch (e) {
        return next(e);
    }
});

function deduplicate(members) {
    let __members = [];
    members.map(member => {
        __members.push(member.toString());
    })
    let isExist = (array, x) => array.indexOf(x) > -1;
    let _members = [];
    for (let i = 0; i < __members.length; i++) {
        if(!isExist(_members, __members[i])) {
            console.log(__members[i]);
            _members.push(__members[i])
        }
    }
    return _members;
}

const Group = mongoose.model('groups', groupSchema);

export default Group;