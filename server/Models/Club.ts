import mongoose, { Schema } from 'mongoose';

const clubSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    strength: {
        type: Number,
        default: 1
    },
    clubHeads: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    username: String,
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pendingRequests: [{
        _id:{
        type: Schema.Types.ObjectId,
        ref: 'User'
        },
        name: String
    }]
});

const Club = mongoose.model('Club', clubSchema);

export default Club;
