import mongoose from 'mongoose';
import User from "./user";

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is require'],
        max: [255, 'Name too long'],
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: [true, 'Last message is require'],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is require'],
    },
    members: [{
        type:  Schema.Types.ObjectId,
        ref: 'User',
    }],
    type: {
        type:  String,
        enum: ['private', 'public'],
        default: 'private',
    },
    deletedAt: {
        type: String,
        default: null,
    }
}, {timeStamp: true});
// arrow function => override this variable
groupSchema.pre('save', async function (next) {
    try {
        // const users = await User.find({_id:  { "$in": this.members}});
        // const user = await User.findById({_id: this.author });
        // if (users.length !== this.members.length) {
        //     const err = new Error('Member is not found');
        //     return next(err);
        // }
        // if (user === null) {
        //     const err = new Error('Member is not found');
        //     return next(err);
        // }
    } catch (e) {
        return next(e);
    }
});

groupSchema.pre('update', async function (next) {
    try {
        const { members, author } = this._update._group;
        const setOfMembers = new Set();
        for (const member of members) {
            setOfMembers.add(member);
        }
        const addedMember = Array.from(setOfMembers);
        const _members = await User.find({ _id:  { "$in": addedMember } }).select('_id').lean(true);
        const _author = await User.find({ _id: author }).select('_id').lean(true);
        if (_members.length !== addedMember.length) {
            const err = new Error('Member is not found');
            return next(err);
        }
        if (_author.length === 0) {
            const err = new Error('Member is not found');
            return next(err);
        }
    } catch (e) {
        return next(e);
    }
});

const Group = mongoose.model('groups', groupSchema);

export default Group;