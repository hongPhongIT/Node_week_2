import User from '../models/user';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const SECRETKEY = '/\@3dhmd@\/"';
import JWT from 'jsonwebtoken';

const UserController = {};

const checkToken = async (token, next) => {
    try {
        if (!token) {
            return next(new Error('Not found authentication'));
        }
        const data = await JWT.verify(token, SECRETKEY);
        const _id = data._id;
        const user = User.findOne({ _id: _id, deleteAt: null });
        return user;
    } catch (e) {
        return next(e);
    }

}

UserController.getAll = async (req, res, next) => {
    try {
        const user = checkToken(req.headers.token, next);

        if (!user) {
            return next(new Error('User is not found'));
        }
        const users = await User.find({ deleteAt: null });
        return res.json({
            isSuccess: true,
            users,
        });
    } catch (e) {
        return next(e);
    }
};

UserController.getUser = async (req, res, next) => {
    const user = checkToken(req.headers.token, next);

    if (!user) {
        return next(new Error('User is not found'));
    }
    const userId = req.params.id;
    try {
        const user = await User.findOne({ _id: userId, deleteAt: null });
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            delete user.password;
            return res.status(200).json({ isSuccess: true, user: user });
        }
    } catch (e) {
        return next(e);
    }

};

UserController.addUser = async (req, res, next) => {
    try {
        const user = new User({
            ...req.body
        });
        const password = user.password;
        await bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                user.password = hash;
                user.save();
            });
        });
        delete user._doc.password;
        return res.json({
            isSuccess: true,
            user: user
        })
    } catch (e) {
        return next(e);
    }
};

UserController.updateUser = async (req, res, next) => {
    const user = checkToken(req.headers.token, next);

    if (!user) {
        return next(new Error('User is not found'));
    }

    const userId = req.params.id;
    try {
        const user = await User.findOne({ _id: userId, deleteAt: null });
        let { lastName, firstName } = req.body;
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
            user.update(_user);
            delete user.password;
            return res.status(200).json({ isSuccess: true, user: user });
        }
    } catch (e) {
        return next(e);
    }
};

UserController.login = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return next(new Error('User is not found'));
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return next(new Error('Password is not correct'));
        }
        delete user._doc.password;
        const token = await JWT.sign(user._doc, SECRETKEY);
        return res.json({
            isSuccess: true,
            user,
            token
        });
    } catch (e) {
        return next(e);
    }
}

UserController.deleteUser = async (req, res, next) => {

    const user = checkToken(req.headers.token, next);

    if (!user) {
        return next(new Error('User is not found'));
    }

    const userId = req.params.id;
    try {
        const user = await User.findOne({ _id: userId, deleteAt: null });
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            const date = new Date();
            user.deleteAt = date;
            await user.update(user);
            delete user.password;
            return res.status(200).json({ isSuccess: true, user: user });
        }
    } catch (e) {
        return next(e);
    }
};

UserController.changePassword = async (req, res, next) => {
    try {
        let user = await checkToken(req.headers.token, next);
        if (!user) {
            return next(new Error('User is not found'));
        }
        const { oldPassword, newPassword, reEnterNewPassword } = req.body;
        const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isCorrectPassword) {
            return next(new Error('Password is not correct'));
        }

        if (newPassword !== reEnterNewPassword) {
            return next(new Error('ReEnterPassword and New password is not match'));
        }
        await bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(newPassword, salt, async function(err, hash) {
                user.password = hash;
                await user.update(user);
            });
        });
        delete user.password;
        return res.status(200).json({
            isSuccess: true,
            user: user,
        });
    } catch (e) {
        return next(e);
    }
}

export default UserController;
