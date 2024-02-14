import express from 'express'
import { createEvent, createSuggestion, deleteEventById, getAllEvents, getAllSuggestions } from '../Controllers/EventController'
import { verifyStaff } from '../middlewares/staffVerify'

const eventRouter = express.Router()

eventRouter.route("/").get(getAllEvents)
eventRouter.route("/:id").delete(verifyStaff, deleteEventById)
eventRouter.route("/create").post(verifyStaff, createEvent)
eventRouter.route("/getAllSuggestions/:id").get(getAllSuggestions)
eventRouter.route("/suggestion/:id").post(createSuggestion)


export { eventRouter }