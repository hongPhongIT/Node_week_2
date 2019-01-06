import Group from '../models/group';

const GroupController = {};

GroupController.getAll = async (req, res, next) => {
    try {
        const groups = await Group.find({ deleteAt: null });
        //sua
        if (!groups) {
            return res.status(400).json({ isSuccess: false, message: 'Have no group' });
        } else {
            return res.status(200).json({ isSuccess: true, groups: groups });
        }
    } catch (e) {
        return next(e);
    }
};

GroupController.getGroup = async (req, res, next) => {
    const groupId = req.params.id;
    try {
        const group = await Group.find({ _id: groupId, deleteAt: null });
        if (!group) {
            return res.status(400).json({ isSuccess: false, message: 'Group is not found' });
        } else {
            return res.status(200).json({ isSuccess: true, group: group });
        }
    } catch (e) {
        return next(e);
    }

};

GroupController.addGroup = async (req, res, next) => {
    try {
        const { name, lastMessage, author, members } = req.body;
        const group = new Group({
            name,
            lastMessage,
            author,
            members,
        });
        await group.save();
        return res.json({
            isSuccess: true,
            group: group
        });
    } catch (e) {
        return next(e);
    }
};

GroupController.updateGroup = async (req, res, next) => {
    const groupId = req.params.id;
    try {
        const group = await Group.findOne({_id: groupId, deleteAt: null});
        let {name, lastMessage, author, members} = req.body;
        if (!group) {
            return res.status(400).json({isSuccess: false, message: 'User is not found'});
        } else {
            let _group = {
                name: group.name,
                lastMessage: group.lastMessage,
                author: group.author,
                members: group.members,
            };
            if (name !== undefined)
                _group.name = name;
            if (lastMessage !== undefined) {
                _group.lastMessage = lastMessage;
            }
            if (author !== undefined) {
                _group.author = author;
            }
            if (members !== undefined) {
                members.map(member => {
                    _group.members.push(member);
                });
            }
            await group.update({_group});
            return res.status(200).json({isSuccess: true, group: group});
        }
    } catch (e) {
        return next(e);
    }
};

GroupController.deleteGroup = async (req, res, next) => {
    const groupId = req.params.id;
    try {
        let group = await Group.findOne({_id: groupId, deleteAt: null });
        if (!group) {
            return res.status(400).json({ isSuccess: false, message: 'Group is not found' });
        } else {
            const date = new Date();
            group.deleteAt = date;
            await group.update(group);
            return res.status(200).json({ isSuccess: true, group: group });
        }
    } catch (e) {
        return next(e);
    }
};

export default GroupController;
