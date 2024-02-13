import express from 'express'
import { createEvent, deleteEventById, getAllEvents } from '../Controllers/EventController'
import { verifyStaff } from '../middlewares/staffVerify'

const eventRouter = express.Router()

eventRouter.route("/").get(getAllEvents)
eventRouter.route("/:id").delete(verifyStaff, deleteEventById)
eventRouter.route("/create").post(verifyStaff, createEvent)

export { eventRouter }