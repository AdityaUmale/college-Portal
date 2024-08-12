import express from 'express'
import { verifyStaff } from '../middlewares/staffVerify'
import { acceptClassroomRequest, applyClassroom, createClassroom, createPost, deleteClassroom, deletePost, getAllClassrooms, getAllPosts, removeClassroomMember, revertClassroomApplication } from '../Controllers/ClassroomController'


const ClassroomRouter = express.Router()

ClassroomRouter.route("/").get(getAllClassrooms)
ClassroomRouter.route("/apply/:id").post(applyClassroom)
ClassroomRouter.route("/create").post(verifyStaff, createClassroom)
ClassroomRouter.route('/:id/members').get(getAllClassrooms)
ClassroomRouter.route('/accept-request/:id/:userId').post(acceptClassroomRequest)
ClassroomRouter.route('/:id').delete(deleteClassroom)
ClassroomRouter.route('/:id/remove-member/:userId').post(removeClassroomMember)
ClassroomRouter.route("/revert-application/:id").post(revertClassroomApplication)
ClassroomRouter.route("/revert-application/:id").post(revertClassroomApplication)
ClassroomRouter.route("/:id/posts/:userId").post(createPost)
ClassroomRouter.route("/:id/posts").get(getAllPosts)
ClassroomRouter.route("/:id/posts/:postId").delete(deletePost)

export { ClassroomRouter }