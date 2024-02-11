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
exports.applyClub = exports.createClub = exports.getAllClubs = void 0;
const Club_1 = __importDefault(require("../Models/Club"));
const ClubSchema_1 = require("../Schema/ClubSchema");
const User_1 = __importDefault(require("../Models/User"));
const getAllClubs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubs = yield Club_1.default.find();
        if (!clubs || clubs.length === 0) {
            return res.status(404).json({ message: 'No clubs found' });
        }
        res.json(clubs);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllClubs = getAllClubs;
const createClub = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const validatedData = ClubSchema_1.ClubSchema.parse(req.body);
        const newClub = yield Club_1.default.create(Object.assign(Object.assign({}, validatedData), { clubHead: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "staff") {
            return res.status(403).json({ message: 'You are not authorized to create club' });
        }
        res.status(201).json({ message: 'Club created successfully', club: newClub });
    }
    catch (error) {
        next(error);
    }
});
exports.createClub = createClub;
const applyClub = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const clubId = req.params.id;
        const club = yield Club_1.default.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) == "staff") {
            return res.status(405).json({ message: "Staff cannot join any club" });
        }
        const userToBeUpdated = yield User_1.default.findById((_d = req.user) === null || _d === void 0 ? void 0 : _d._id);
        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userToBeUpdated.clubs.includes(club.name)) {
            return res.status(404).json({ message: 'User is already in the club' });
        }
        club.strength += 1;
        yield club.save();
        userToBeUpdated.clubs.push(club.name);
        yield userToBeUpdated.save();
        res.json({ message: 'Club applied successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.applyClub = applyClub;
