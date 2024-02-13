"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementRouter = void 0;
const express_1 = __importDefault(require("express"));
const staffVerify_1 = require("../middlewares/staffVerify");
const AnnouncementControllers_1 = require("../Controllers/AnnouncementControllers");
const announcementRouter = express_1.default.Router();
exports.announcementRouter = announcementRouter;
announcementRouter.route("/").get(AnnouncementControllers_1.getAllAnnouncements);
announcementRouter.route("/:id").delete(staffVerify_1.verifyStaff, AnnouncementControllers_1.deleteAnnouncementById);
announcementRouter.route("/create").post(staffVerify_1.verifyStaff, AnnouncementControllers_1.createAnnouncement);
