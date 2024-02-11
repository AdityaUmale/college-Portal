"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
const UserAuth_1 = require("../Controllers/UserAuth");
authRouter.route("/login").post(UserAuth_1.login);
authRouter.route("/signup").post(UserAuth_1.register);
