"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
const EventController_1 = require("../Controllers/EventController");
const staffVerify_1 = require("../middlewares/staffVerify");
const eventRouter = express_1.default.Router();
exports.eventRouter = eventRouter;
eventRouter.route("/").get(EventController_1.getAllEvents);
eventRouter.route("/:id").delete(staffVerify_1.verifyStaff, EventController_1.deleteEventById);
eventRouter.route("/create").post(staffVerify_1.verifyStaff, EventController_1.createEvent);
