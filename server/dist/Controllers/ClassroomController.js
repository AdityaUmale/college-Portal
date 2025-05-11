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
exports.getAllPosts = exports.deletePost = exports.createPost = exports.revertClassroomApplication = exports.removeClassroomMember = exports.deleteClassroom = exports.acceptClassroomRequest = exports.getClubMembers = exports.applyClassroom = exports.createClassroom = exports.getAllClassrooms = void 0;
const User_1 = __importDefault(require("../Models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const Classroom_1 = __importDefault(require("../Models/Classroom"));
const ClassroomSchema_1 = require("../Schema/ClassroomSchema");
const getAllClassrooms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classrooms = yield Classroom_1.default.find()
            .populate('members', 'name')
            .populate('pendingRequests._id', 'name');
        if (!Classroom_1.default || Classroom_1.default.length === 0) {
            return res.status(404).json({ message: 'No classrooms found' });
        }
        res.json(classrooms);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllClassrooms = getAllClassrooms;
const createClassroom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const validatedData = ClassroomSchema_1.ClassroomSchema.parse(req.body);
        const newClassroom = yield Classroom_1.default.create(Object.assign(Object.assign({}, validatedData), { username: (_a = req.user) === null || _a === void 0 ? void 0 : _a.name }));
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "staff") {
            return res.status(403).json({ message: 'You are not authorized to create club' });
        }
        res.status(201).json({ message: 'Classroom created successfully', classroom: newClassroom });
    }
    catch (error) {
        next(error);
    }
});
exports.createClassroom = createClassroom;
const applyClassroom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const classroomId = req.params.id;
        const classroom = yield Classroom_1.default.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) == "staff") {
            return res.status(405).json({ message: "Staff cannot join any classroom" });
        }
        const userToBeUpdated = yield User_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (classroom.members.includes(userToBeUpdated._id)) {
            return res.status(400).json({ message: 'User is already in the classroom' });
        }
        if (classroom.pendingRequests.some(request => request._id && request._id.toString() === userToBeUpdated._id.toString())) {
            return res.status(400).json({ message: 'User has already requested to join this classroom' });
        }
        classroom.pendingRequests.push({ _id: userToBeUpdated._id, name: (_c = userToBeUpdated.name) !== null && _c !== void 0 ? _c : '' });
        yield classroom.save();
        res.json({ message: 'Classroom join request sent successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.applyClassroom = applyClassroom;
const getClubMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classroomId = req.params.id;
        const classroom = yield Classroom_1.default.findById(classroomId).populate('members', 'name');
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.json(classroom.members);
    }
    catch (error) {
        next(error);
    }
});
exports.getClubMembers = getClubMembers;
const acceptClassroomRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const classroomId = req.params.id;
        const userId = typeof req.params.userId === 'string' ? req.params.userId : JSON.parse(req.params.userId).id;
        const classroom = yield Classroom_1.default.findById(classroomId);
        console.log('Found classroom:', classroom ? 'Yes' : 'No');
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        console.log('Classroom pending requests:', JSON.stringify(classroom.pendingRequests));
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "staff") {
            return res.status(403).json({ message: 'You are not authorized to accept classroom requests' });
        }
        const pendingRequestIndex = classroom.pendingRequests.findIndex(request => request._id && request._id.toString() === userId);
        if (pendingRequestIndex === -1) {
            return res.status(404).json({ message: 'User request not found' });
        }
        console.log('Pending request index:', pendingRequestIndex);
        const acceptedUser = classroom.pendingRequests[pendingRequestIndex];
        classroom.pendingRequests.splice(pendingRequestIndex, 1);
        if (acceptedUser._id) {
            classroom.members.push(acceptedUser._id);
        }
        classroom.strength += 1;
        yield classroom.save();
        const user = yield User_1.default.findById(userId);
        if (user) {
            user.clubs.push(classroom.name);
            yield user.save();
        }
        res.json({ message: 'User request accepted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.acceptClassroomRequest = acceptClassroomRequest;
const deleteClassroom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const classroomId = req.params.id;
        // Check if the user is staff
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "staff") {
            return res.status(403).json({ message: 'Only staff can delete clubs' });
        }
        // Find and delete the club
        const deletedClassroom = yield Classroom_1.default.findByIdAndDelete(classroomId);
        if (!deletedClassroom) {
            return res.status(404).json({ message: 'Club not found' });
        }
        // Remove the club from all members' club lists
        yield User_1.default.updateMany({ clubs: deletedClassroom.name }, { $pull: { classrooms: deletedClassroom.name } });
        res.json({ message: 'Classroom deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteClassroom = deleteClassroom;
const removeClassroomMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.params;
        const classroomId = req.params.id;
        const classroom = yield Classroom_1.default.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "staff") {
            return res.status(403).json({ message: 'Not authorized to remove members' });
        }
        classroom.members = classroom.members.filter(member => member.toString() !== userId);
        yield classroom.save();
        yield User_1.default.findByIdAndUpdate(userId, { $pull: { classrooms: classroom.name } });
        res.json({ message: 'Member removed successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.removeClassroomMember = removeClassroomMember;
const revertClassroomApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const classroomId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const classroom = yield Classroom_1.default.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        // Use the pull method to remove the matching request
        classroom.pendingRequests = classroom.pendingRequests.filter(request => request._id.toString() !== userId);
        yield classroom.save();
        res.json({ message: 'Classroom application reverted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.revertClassroomApplication = revertClassroomApplication;
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const classroom = yield Classroom_1.default.findById(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        const newPost = {
            _id: new mongoose_1.default.Types.ObjectId(),
            content,
            createdBy: userId !== null && userId !== void 0 ? userId : new mongoose_1.default.Types.ObjectId(), // Provide a default ObjectId if userId is undefined
            createdAt: new Date()
        };
        // Push the new post to the posts array
        if (!Array.isArray(classroom.posts)) {
            classroom.posts = [];
        }
        classroom.posts.push(newPost);
        yield classroom.save();
        res.status(201).json(newPost);
    }
    catch (error) {
        next(error);
    }
});
exports.createPost = createPost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id, postId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const classroom = yield Classroom_1.default.findById(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        const initialLength = classroom.posts.length;
        classroom.posts = classroom.posts.filter(post => !(post._id.toString() === postId && post.createdBy.toString() === userId.toString()));
        if (classroom.posts.length === initialLength) {
            return res.status(404).json({ message: 'Post not found or you are not authorized to delete this post' });
        }
        yield classroom.save();
        res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.deletePost = deletePost;
const getAllPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const classroom = yield Classroom_1.default.findById(id).populate({
            path: 'posts.createdBy',
            select: 'name'
        });
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.json(classroom.posts);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPosts = getAllPosts;
