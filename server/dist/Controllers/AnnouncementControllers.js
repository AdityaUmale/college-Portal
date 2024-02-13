"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnnouncement = exports.deleteAnnouncementById = exports.getAllAnnouncements = void 0;
const Announcement_1 = __importDefault(require("../Models/Announcement"));
const AnnouncementSchema_1 = require("../Schema/AnnouncementSchema");
const getAllAnnouncements = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcements = yield Announcement_1.default.find().sort({ _id: -1 });
        if (!announcements || announcements.length === 0) {
            return res.status(404).json({ message: 'No announcements found' });
        }
        res.json(announcements);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllAnnouncements = getAllAnnouncements;
const deleteAnnouncementById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcementId = req.params.id;
        const deletedAnnouncement = yield Announcement_1.default.findByIdAndDelete(announcementId);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.json({ message: 'Announcement deleted successfully', deletedAnnouncement });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAnnouncementById = deleteAnnouncementById;
const createAnnouncement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const validatedData = AnnouncementSchema_1.AnnouncementSchema.parse(req.body);
        const newAnnouncement = yield Announcement_1.default.create(Object.assign(Object.assign({}, validatedData), { createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, username: (_b = req.user) === null || _b === void 0 ? void 0 : _b.name }));
        res.status(201).json({ message: 'Announcement created successfully', announcement: newAnnouncement });
    }
    catch (error) {
        next(error);
    }
});
exports.createAnnouncement = createAnnouncement;
