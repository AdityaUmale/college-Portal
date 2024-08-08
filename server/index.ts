import bodyparser from 'body-parser'
import express from 'express'
import { authRouter } from './Routes/UserAuth'
import connectToDb from './Database/connectToDb'
import { App as appConfig } from './Config/config'
import cors from "cors";
import { eventRouter } from './Routes/EventRoutes'
import { announcementRouter } from './Routes/AnnouncementRoutes'
import { isLoggedIn } from './middlewares/isLoggedIn'
import { ClubRouter } from './Routes/ClubRouter'
import { ClassroomRouter } from './Routes/ClassroomRouter'
const app = express()
app.use(cors())
app.use(bodyparser.json())

app.use('/api/v1/auth', authRouter)
app.use(isLoggedIn)
app.use('/api/v1/event', eventRouter)
app.use('/api/v1/announcement', announcementRouter)
app.use('/api/v1/club', ClubRouter)
app.use('/api/v1/classroom', ClassroomRouter)

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