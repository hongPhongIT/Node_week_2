import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let uploadSchema = new Schema({
    deletedAt: {
        type: String,
        default: null,
    },
    // lastUpdate: {
    //     type:
    // }
}, { timeStamp: true });

// uploadSchema.post('save', function (next) {

// })

let Upload = mongoose.model('User', uploadSchema);

export default Upload;