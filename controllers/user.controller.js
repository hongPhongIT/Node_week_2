import User from '../models/user';
const SECRETKEY = '/\@3dhmd@\/"';
const bcrypt = require('bcrypt');
import JWT from 'jsonwebtoken';
const nodemailer = require("nodemailer");


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
        "use strict";
// async..await is not allowed in global scope, must use a wrapper
async function main(){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: 'support@hearti.io', // generated ethereal user
      pass: '$WellieMy$1' // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "phong.nguyen@student.passerellesnumeriques.org", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
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
