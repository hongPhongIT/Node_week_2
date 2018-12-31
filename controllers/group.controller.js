import Group from '../models/group';

const GroupController = {};

GroupController.getAll = async (req, res, next) => {
    try {
        const groups = await Group.find({ deleteAt: '' });
        if (!groups) {
            return res.status(400).json({ isSuccess: false, groups: 'Have no group' });
        } else {
            return res.status(200).json({ isSuccess: true, groups: groups });
        }
    } catch (e) {
        next(e);
    }
};

GroupController.getGroup = async (req, res, next) => {
    const groupId = req.params.id;
    try {
        const group = await Group.find({ '_id': groupId, deleteAt: '' });
        if (!group) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            return res.status(200).json({ isSuccess: true, group: group });
        }
    } catch (e) {
        next(e);
    }

};

GroupController.addGroup = async (req, res, next) => {
    try {
        console.log(req.body);
        const group = new Group({
            ...req.body
        });
        await group.save();
        return res.json({
            isSuccess: true,
            group: group
        });
    } catch (e) {
        next(e);
    }
};

GroupController.updateGroup = async (req, res, next) => {
    const groupId = req.params.id;
    try {
        const group = await Group.find({ groupId, deleteAt: '' });
        let { name, lastMessage, author, members } = req.body;
        if (!group) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            let _group = group;
            if (name !== undefined) {
                _group.name = name;
            }
            if (lastMessage !== undefined) {
                _group.lastMessage = lastMessage;
            }
            if (author !== undefined) {
                _group.author = author;
            }
            if (members !== undefined) {
                _group.members = members;
            }
            group.update(_group);
            return res.status(200).json({ isSuccess: true, group: group });
        }
    } catch (e) {
        next(e);
    }
};

GroupController.deleteGroup = async (req, res, next) => {
    const groupId = req.params.id;
    try {
        const group = await Group.find({ groupId, deleteAt: '' });
        if (!group) {
            return res.status(400).json({ isSuccess: false, message: 'Group is not found' });
        } else {
            const date = new Date().toDateString();
            group.update({ deleteAt: date });
            return res.status(200).json({ isSuccess: true, group: group });
        }
    } catch (e) {
        next(e);
    }
};

export default GroupController;
