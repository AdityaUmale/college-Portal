import express from 'express'
const authRouter = express.Router()

import { login, register } from "../Controllers/UserAuth"

authRouter.route("/login").post(login)
authRouter.route("/signup").post(register)

export { authRouter }