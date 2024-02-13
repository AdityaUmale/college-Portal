import mongoose, { Schema } from 'mongoose';

const clubSchema = new Schema({
    name: String,
    description: String,
    strength: {
        type: Number,
        default: 1
    },
    clubHead: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    username: String,
});

const Club = mongoose.model('Club', clubSchema);

export default Club;
