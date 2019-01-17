import User from '../models/user';
const SECRETKEY = '/\@3dhmd@\/"';
const bcrypt = require('bcrypt');
import JWT from 'jsonwebtoken';

import { StringHandler, ResponseHandler } from '../helper'

const UserController = {};

UserController.getAll = async (req, res, next) => {
    try {
        const users = await User.find({ deleteAt: null }).lean(true);
        ResponseHandler.returnSuccess(res, users);
    } catch (e) {
        return next(e);
    }
};

UserController.getUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({ _id: userId, deleteAt: null }).lean(true);
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            delete user.password;
        ResponseHandler.returnSuccess(res, user);
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
        delete user._doc.deleteAt;
        const password = user.password;
        const hash = await StringHandler.hashStringToBcryt(password);
        user.password = hash;
        await user.save();
        delete user._doc.password;
        ResponseHandler.returnSuccess(res, user);
    } catch (e) {
        return next(e);
    }
};

UserController.updateUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({ _id: userId, deleteAt: null }).lean(true);
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
            User.update(_user);
            delete user.password;
            ResponseHandler.returnSuccess(res, user);
        }
    } catch (e) {
        return next(e);
    }
};

UserController.login = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({email}).lean(true);
        if (!user) {
            return next(new Error('User is not found'));
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return next(new Error('Password is not correct'));
        }
        delete user.password;
        const token = await JWT.sign(user, SECRETKEY);
        ResponseHandler.returnSuccess(res, { user, token });
    } catch (e) {
        return next(e);
    }
}

UserController.deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({ _id: userId, deleteAt: null }).lean(true);
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'User is not found' });
        } else {
            const date = new Date();
            user.deleteAt = date;
            await User.update(user);
            delete user.password;
            ResponseHandler.returnSuccess(res, user);
        }
    } catch (e) {
        return next(e);
    }
};

UserController.changePassword = async (req, res, next) => {
    try {
        const { password } = req.user;
        console.log( req.user)
        const UserId = req.params.id;
        const { oldPassword, newPassword } = req.body;
        
        const isCorrectPassword = await bcrypt.compare(oldPassword, password);
        if (!isCorrectPassword) {
            return next(new Error('Password is not correct'));
        }

        const hash = await StringHandler.hashStringToBcryt(newPassword);
        await User.update({_id: UserId}, {$set: { password: hash }});
        ResponseHandler.returnSuccess(res, {});
    } catch (e) {
        return next(e);
    }
}

export default UserController;
