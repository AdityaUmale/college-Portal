import express from 'express'
import { verifyStaff } from '../middlewares/staffVerify'
import { acceptClubRequest, applyClub, createClub, deleteClub, getAllClubs, getClubMembers } from '../Controllers/ClubController'


const ClubRouter = express.Router()

ClubRouter.route("/").get(getAllClubs)
ClubRouter.route("/apply/:id").post(applyClub)
ClubRouter.route("/create").post(verifyStaff, createClub)
ClubRouter.route('/:id/members').get(getClubMembers)
ClubRouter.route('/accept-request/:id/:userId').post(acceptClubRequest)
ClubRouter.route('/:id').delete(deleteClub)

export { ClubRouter }