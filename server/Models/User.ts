import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  role: {
    type: String,
    enum: ["user", "staff"]
  },
  clubs: {
    type: [String],
    default: []
  }
});

const User = mongoose.model('User', userSchema);

export default User;
