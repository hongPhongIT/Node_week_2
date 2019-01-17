import Group from '../models/group';

const GroupController = {};

GroupController.getAll = async (req, res, next) => {

    const { page, limit } = req.query;
    const skip = (parseInt(page) -1) * parseInt(limit);
    try {
        const groups = await Group
            .find({ deletedAt: null })
            .populate([
                {
                    path: 'author',
                    select: 'email fullName'
                },
                {
                    path: 'members',
                    select: 'fullName email'
                }
            ])
            .sort({ createAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        return res.status(200).json({ isSuccess: true, groups: groups });
    } catch (e) {
        return next(e);
    }
};

GroupController.getGroup = async (req, res, next) => {
    const groupId = req.params.id;
    try {
        const group = await Group.find({ _id: groupId, deletedAt: null }).lean(true);
        return res.status(200).json({ isSuccess: true, group: group });
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
        const group = await Group.findOne({_id: groupId, deletedAt: null});
        let { name, lastMessage, author, members } = req.body;
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
        let group = await Group.findOne({_id: groupId, deletedAt: null });
        if (!group) {
            return res.status(400).json({ isSuccess: false, message: 'Group is not found' });
        } else {
            const date = new Date();
            group.deletedAt = date;
            await group.update(group);
            return res.status(200).json({ isSuccess: true, group: group });
        }
    } catch (e) {
        return next(e);
    }
};

export default GroupController;
