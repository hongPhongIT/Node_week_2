import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let userSchema = new Schema({
    gender: Boolean,
    fullName: {
        firstName: {
            type: String,
            required: [true, 'First name is require'],
            max: [30, 'First name too long'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is require'],
            max: [30, 'Last name too long'],
        }
    },
    email: {
        type: String,
        required: [true, 'Email name is require'],
        maxlength: [255, 'Email to log'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is require'],
        max: [30, 'Password too long'],
        min: [6, 'Password too sort'],
    },
    deleteAt: {
        type: String,
        default: null,
    }
});

userSchema.post('save', function (next) {

})

let User = mongoose.model('User', userSchema);

export default User;