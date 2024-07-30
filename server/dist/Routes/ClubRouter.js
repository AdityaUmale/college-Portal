"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubRouter = void 0;
const express_1 = __importDefault(require("express"));
const staffVerify_1 = require("../middlewares/staffVerify");
const ClubController_1 = require("../Controllers/ClubController");
const ClubRouter = express_1.default.Router();
exports.ClubRouter = ClubRouter;
ClubRouter.route("/").get(ClubController_1.getAllClubs);
ClubRouter.route("/apply/:id").post(ClubController_1.applyClub);
ClubRouter.route("/create").post(staffVerify_1.verifyStaff, ClubController_1.createClub);
ClubRouter.route('/:id/members').get(ClubController_1.getClubMembers);
ClubRouter.route('/accept-request/:id/:userId').post(ClubController_1.acceptClubRequest);
ClubRouter.route('/:id').delete(ClubController_1.deleteClub);
ClubRouter.route('/:id/remove-member/:userId').post(ClubController_1.removeMember);
ClubRouter.route('/:id/assign-head/:userId').post(ClubController_1.assignClubHead);
