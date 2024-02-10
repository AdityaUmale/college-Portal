import mongoose from 'mongoose'
import { Mongo } from '../Config/config'

async function connectToDb() {
  mongoose
    .connect(Mongo.url)
    .then(() => {
      console.log('Connection to Db was Successfull !')
    })

}



export default connectToDb