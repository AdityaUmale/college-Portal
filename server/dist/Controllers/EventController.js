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
exports.createEvent = exports.deleteEventById = exports.createSuggestion = exports.getAllSuggestions = exports.getAllEvents = void 0;
const Event_1 = __importDefault(require("../Models/Event"));
const EventSchema_1 = require("../Schema/EventSchema");
const getAllEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.default.find().sort({ _id: -1 });
        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }
        res.json(events);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllEvents = getAllEvents;
const getAllSuggestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const eventId = req.params.id;
        const event = yield Event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        let newSuggestions = [];
        for (const suggestion of event.suggestions) {
            newSuggestions.push({ suggestion: suggestion.suggestion, createdBy: suggestion.createdBy === event.createdBy ? 'Author' : suggestion.createdBy === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) ? 'You' : 'Anonymous' });
        }
        res.json({ suggestions: newSuggestions });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSuggestions = getAllSuggestions;
const createSuggestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const eventId = req.params.id;
        const event = yield Event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const suggestion = req.body.suggestion;
        event.suggestions.push({ suggestion, createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        yield event.save();
        res.json(event.suggestions);
    }
    catch (error) {
        next(error);
    }
});
exports.createSuggestion = createSuggestion;
const deleteEventById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.id;
        const deletedEvent = yield Event_1.default.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully', deletedEvent });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteEventById = deleteEventById;
const createEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const validatedData = EventSchema_1.EventSchema.parse(req.body);
        const username = (_c = req.user) === null || _c === void 0 ? void 0 : _c.name;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const newEvent = yield Event_1.default.create(Object.assign(Object.assign({}, validatedData), { createdBy: userId, username: username }));
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    }
    catch (error) {
        next(error);
    }
});
exports.createEvent = createEvent;
