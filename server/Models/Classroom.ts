import mongoose, { Schema, Document } from 'mongoose';

export interface IPost {
    _id: mongoose.Types.ObjectId;
    content: string;
    createdBy: mongoose.Types.ObjectId | string;
    createdAt: Date;
  }

interface IPendingRequest {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface IClassroom extends Document {
  name: string;
  description?: string;
  strength: number;
  username?: string;
  members: mongoose.Types.ObjectId[];
  pendingRequests: IPendingRequest[];
  posts: IPost[];
}

const PostSchema = new Schema<IPost>({
  _id: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const classroomSchema = new Schema<IClassroom>({
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
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String
  }],
  posts: [PostSchema]
});

const Classroom = mongoose.model<IClassroom>('Classroom', classroomSchema);
export default Classroom;