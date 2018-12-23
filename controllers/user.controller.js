import User from '../models/user';

const UserController = {};

UserController.getAll = async (req, res) => {
    try {
        await User.find().sort('-dateAdded').exec((err, users) => {
            if (err) {
                res.status(500).send(err);
            }
            return res.json({
                users,
            });
        });
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            message: err.message,
            error: err
        });
    }
};

UserController.getUser = async (req, res) => {

};

UserController.addUser = async (req, res) => {
    try {
        const user = new User({
            ...req.body
        });
        await user.save();
        return res.json({
            isSuccess: true,
            user: user
        })
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            message: err.message,
            error: err
        });
    }
};

UserController.updateUser = async (req, res) => {

};

UserController.deleteUser = async (req, res) => {

};

export default UserController;
