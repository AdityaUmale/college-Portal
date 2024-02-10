import mongoose, { Schema } from 'mongoose'


const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt:String,
  updatedAt:String,
})

const User = mongoose.model('User', userSchema)

export default User