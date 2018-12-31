import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is require'],
        max: [255, 'First name too long'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is require'],
        max: [255, 'Last name too long'],
    },
    email: {
        type: String,
        required: [true, 'Email name is require'],
    },
    password: {
        type: String,
        required: [true, 'Password is require'],
        max: [30, 'Password too long'],
        min: [6, 'Password too sort'],
    },
    deleteAt: {
        type: String,
        default: '',
    }
});

let User = mongoose.model('User', userSchema);

export default User;