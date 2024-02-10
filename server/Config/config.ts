import { Environment } from './enviorment'
import dotenv from 'dotenv'
dotenv.config()

const env: Environment = <any>process.env
export const App = {
  port: env.PORT || 3000,
}

export const Mongo = {
  url: env.MONGO_URL,
}


export const JwtConfig = {
  key: process.env.JWT_KEY || 'ASFKJHASFJASLKFJS',
}