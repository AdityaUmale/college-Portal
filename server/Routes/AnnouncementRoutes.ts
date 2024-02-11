import express from 'express'
import { verifyStaff } from '../middlewares/staffVerify'
import { createAnnouncement, deleteAnnouncementById, getAllAnnouncements } from '../Controllers/AnnouncementControllers'

const announcementRouter = express.Router()

announcementRouter.route("/").get(getAllAnnouncements)
announcementRouter.route("/:id").delete(verifyStaff, deleteAnnouncementById)
announcementRouter.route("/create").post(verifyStaff, createAnnouncement)

export { announcementRouter }