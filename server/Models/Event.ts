import mongoose, { Schema } from 'mongoose';

const suggestionSchema = new Schema({
    suggestion: String,
    createdBy: String
});

const eventSchema = new Schema({
    title: String,
    description: String,
    link: String,
    createdBy: String,
    username: String,
    suggestions: [suggestionSchema]
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
