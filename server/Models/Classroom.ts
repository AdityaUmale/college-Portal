import mongoose, { Schema } from 'mongoose';

const classroomSchema = new Schema({
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

const Classroom = mongoose.model('Classroom', classroomSchema);

export default Classroom;
