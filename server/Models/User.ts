import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
})

const User = mongoose.model('User', userSchema)

export default User