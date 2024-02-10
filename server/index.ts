import bodyparser from 'body-parser'
import express from 'express'
import { authRouter } from './Routes/UserAuth'
import connectToDb from './Database/connectToDb'
import { App as appConfig } from './Config/config'
import cors from "cors";
const app = express()
app.use(cors())
app.use(bodyparser.json())

app.use('/api/v1/auth', authRouter)

app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error) {
      res.status(500).send({ error: 'Internal Server Error' })
    }
  }
)

const startServer = async () => {
  try {
    await connectToDb()
    app.listen(appConfig.port, () => {
      console.log(`Server listening on ${appConfig.port}`)
    })
  } catch (error: any) {
    console.log('something went wrong ', error)
  }
}

startServer()