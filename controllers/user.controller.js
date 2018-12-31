import User from '../models/user';

const UserController = {};

UserController.getAll = async (req, res, next) => {
    try {
        await User.find().sort('-dateAdded').exec((e, users) => {
            if (e) {
                res.status(500).send(e);
            }
            return res.json({
                users,
            });
        });
    } catch (e) {
        next(e);
    }
};

UserController.getUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            return res.status(200).json({ isSuccess: true, user: user });
        }
    } catch (e) {
        next(e);
    }

};

UserController.addUser = async (req, res, next) => {
    try {
        const user = new User({
            ...req.body
        });
        await user.save();
        return res.json({
            isSuccess: true,
            user: user
        })
    } catch (e) {
        next(e);
    }
};

UserController.updateUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        let { lastName, firstName, email, password } = req.body;
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            let _user = user;
            if (lastName !== undefined) {
                _user.lastName = lastName;
            }
            if (firstName !== undefined) {
                _user.firstName = firstName;
            }
            if (email !== undefined) {
                _user.email = email;
            }
            if (password !== undefined) {
                _user.password = password;
            }
            user.update(_user);
            return res.status(200).json({ isSuccess: true, user: user });
        }
    } catch (e) {
        next(e);
    }
};

UserController.deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            const date = new Date();
            // console.log(date);
            User.update({ _id: userId }, { deleteAt: date });
            return res.status(200).json({ isSuccess: true, user: user });
        }
    } catch (e) {
        next(e);
    }
};

export default UserController;
