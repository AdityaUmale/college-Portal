import express from 'express'
import { verifyStaff } from '../middlewares/staffVerify'
import { acceptClubRequest, applyClub, assignClubHead, createClub, deleteClub, getAllClubs, getClubMembers, removeClubHead, removeMember, revertClubApplication } from '../Controllers/ClubController'


const ClubRouter = express.Router()

ClubRouter.route("/").get(getAllClubs)
ClubRouter.route("/apply/:id").post(applyClub)
ClubRouter.route("/create").post(verifyStaff, createClub)
ClubRouter.route('/:id/members').get(getClubMembers)
ClubRouter.route('/accept-request/:id/:userId').post(acceptClubRequest)
ClubRouter.route('/:id').delete(deleteClub)
ClubRouter.route('/:id/remove-member/:userId').post(removeMember)
ClubRouter.route('/:id/assign-head/:userId').post(assignClubHead)
ClubRouter.route('/:id/remove-head/:userId').post(removeClubHead)
ClubRouter.route("/revert-application/:id").post(revertClubApplication)

export { ClubRouter }