import express from 'express'
import { verifyStaff } from '../middlewares/staffVerify'
import { acceptClubRequest, applyClub, createClub, getAllClubs, getClubMembers } from '../Controllers/ClubController'
import { verifyStaffOrClubHead } from '../middlewares/verifyStaffOrClubHead'

const ClubRouter = express.Router()

ClubRouter.route("/").get(getAllClubs)
ClubRouter.route("/apply/:id").post(applyClub)
ClubRouter.route("/create").post(verifyStaff, createClub)
ClubRouter.route('/:id/members').get(getClubMembers)
ClubRouter.route('/accept-request/:id/:userId').post(acceptClubRequest)

export { ClubRouter }