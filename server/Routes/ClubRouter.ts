import express from 'express'
import { verifyStaff } from '../middlewares/staffVerify'
import { applyClub, createClub, getAllClubs, getClubMembers } from '../Controllers/ClubController'

const ClubRouter = express.Router()

ClubRouter.route("/").get(getAllClubs)
ClubRouter.route("/apply/:id").get(applyClub)
ClubRouter.route("/create").post(verifyStaff, createClub)
ClubRouter.route('/:id/members').get(getClubMembers)

export { ClubRouter }