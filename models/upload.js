import mongoose from 'mongoose';
import User from "./user";

const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    startUploadAt: {
        type: Date,
        default: '',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    total: {
        type: Number,
        max: 10,
        default: 0,
    },
    filePath: [{
        type: String,
    }],
    blockUploadAt: {
        type: Date,
        default: ''
    },
}, { timeStamp: true });
// arrow function => override this variable
uploadSchema.pre('save', async function (next) {
    try {
        // const { filePath, user } = this
        // const upload = await Upload.findOne({ user: user }).lean();
        // console.log(upload);
        // if (upload.startUploadAt) {
        //     const now = Date.now();
        //     const test = upload.startUploadAt - now;
        //     console.log(upload.startUploadAt);
        // }      
    } catch (e) {
        return next(e);
    }
});

const Upload = mongoose.model('uploads', uploadSchema);

export default Upload;