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
exports.removeMember = exports.assignClubHead = exports.deleteClub = exports.acceptClubRequest = exports.getClubMembers = exports.applyClub = exports.createClub = exports.getAllClubs = void 0;
const Club_1 = __importDefault(require("../Models/Club"));
const ClubSchema_1 = require("../Schema/ClubSchema");
const User_1 = __importDefault(require("../Models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAllClubs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubs = yield Club_1.default.find().populate('members', 'name').populate('pendingRequests._id', 'name');
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
    var _a, _b, _c;
    try {
        const validatedData = ClubSchema_1.ClubSchema.parse(req.body);
        const newClub = yield Club_1.default.create(Object.assign(Object.assign({}, validatedData), { clubHead: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, username: (_b = req.user) === null || _b === void 0 ? void 0 : _b.name }));
        if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== "staff") {
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
    var _a, _b;
    try {
        const clubId = req.params.id;
        const club = yield Club_1.default.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) == "staff") {
            return res.status(405).json({ message: "Staff cannot join any club" });
        }
        const userToBeUpdated = yield User_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (club.members.includes(userToBeUpdated._id)) {
            return res.status(400).json({ message: 'User is already in the club' });
        }
        if (club.pendingRequests.some(request => request._id && request._id.toString() === userToBeUpdated._id.toString())) {
            return res.status(400).json({ message: 'User has already requested to join this club' });
        }
        club.pendingRequests.push({ _id: userToBeUpdated._id, name: userToBeUpdated.name });
        yield club.save();
        res.json({ message: 'Club join request sent successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.applyClub = applyClub;
const getClubMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubId = req.params.id;
        const club = yield Club_1.default.findById(clubId).populate('members', 'name');
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json(club.members);
    }
    catch (error) {
        next(error);
    }
});
exports.getClubMembers = getClubMembers;
const acceptClubRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const clubId = req.params.id;
        const userId = typeof req.params.userId === 'string' ? req.params.userId : JSON.parse(req.params.userId).id;
        console.log('Received request to accept. Club ID:', clubId, 'User ID:', userId);
        console.log('Request params:', req.params);
        console.log('Request body:', req.body);
        const club = yield Club_1.default.findById(clubId);
        console.log('Found club:', club ? 'Yes' : 'No');
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        console.log('Club pending requests:', JSON.stringify(club.pendingRequests));
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "staff" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString()) !== ((_c = club.clubHead) === null || _c === void 0 ? void 0 : _c.toString())) {
            return res.status(403).json({ message: 'You are not authorized to accept club requests' });
        }
        const pendingRequestIndex = club.pendingRequests.findIndex(request => request._id && request._id.toString() === userId);
        if (pendingRequestIndex === -1) {
            return res.status(404).json({ message: 'User request not found' });
        }
        console.log('Pending request index:', pendingRequestIndex);
        const acceptedUser = club.pendingRequests[pendingRequestIndex];
        club.pendingRequests.splice(pendingRequestIndex, 1);
        if (acceptedUser._id) {
            club.members.push(acceptedUser._id);
        }
        club.strength += 1;
        yield club.save();
        const user = yield User_1.default.findById(userId);
        if (user) {
            user.clubs.push(club.name);
            yield user.save();
        }
        res.json({ message: 'User request accepted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.acceptClubRequest = acceptClubRequest;
const deleteClub = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const clubId = req.params.id;
        // Check if the user is staff
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "staff") {
            return res.status(403).json({ message: 'Only staff can delete clubs' });
        }
        // Find and delete the club
        const deletedClub = yield Club_1.default.findByIdAndDelete(clubId);
        if (!deletedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }
        // Remove the club from all members' club lists
        yield User_1.default.updateMany({ clubs: deletedClub.name }, { $pull: { clubs: deletedClub.name } });
        res.json({ message: 'Club deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteClub = deleteClub;
const assignClubHead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { clubId, userId } = req.params;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "staff" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString()) !== clubId) {
            return res.status(403).json({ message: 'Not authorized to assign club head' });
        }
        const club = yield Club_1.default.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        club.clubHead = new mongoose_1.default.Types.ObjectId(userId);
        yield club.save();
        res.json({ message: 'Club head assigned successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.assignClubHead = assignClubHead;
const removeMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { clubId, userId } = req.params;
        const club = yield Club_1.default.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "staff" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString()) !== ((_c = club.clubHead) === null || _c === void 0 ? void 0 : _c.toString())) {
            return res.status(403).json({ message: 'Not authorized to remove members' });
        }
        club.members = club.members.filter(member => member.toString() !== userId);
        yield club.save();
        yield User_1.default.findByIdAndUpdate(userId, { $pull: { clubs: club.name } });
        res.json({ message: 'Member removed successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.removeMember = removeMember;
