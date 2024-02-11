import mongoose, { Schema } from 'mongoose';

const announcementSchema = new Schema({
    title: String,
    description: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
