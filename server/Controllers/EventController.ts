import { Request, Response } from 'express';
import Event from '../Models/Event';
import { EventSchema } from '../Schema/EventSchema';
interface AuthenticatedRequest extends Request {
    user?: { _id: string; role: string, email: string, clubs: [string], name: string };
}
export const getAllEvents = async (req: Request, res: Response, next: Function) => {
    try {
        const events = await Event.find().sort({ _id: -1 });
        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }
        res.json(events);
    } catch (error) {
        next(error);
    }
};
export const getAllSuggestions = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        let newSuggestions = [];
        for (const suggestion of event.suggestions) {
            newSuggestions.push({ suggestion: suggestion.suggestion, createdBy: suggestion.createdBy === event.createdBy ? 'Author' : suggestion.createdBy === req.user?._id ? 'You' : 'Anonymous' });
        }
        res.json({ suggestions: newSuggestions });
    } catch (error) {
        next(error);
    }
};
export const createSuggestion = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const suggestion = req.body.suggestion;
        event.suggestions.push({ suggestion, createdBy: req.user?._id });
        await event.save();
        res.json(event.suggestions);
    } catch (error) {
        next(error);
    }
};
export const deleteEventById = async (req: Request, res: Response, next: Function) => {
    try {
        const eventId = req.params.id;
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully', deletedEvent });
    } catch (error) {
        next(error);
    }
};
export const createEvent = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const validatedData = EventSchema.parse(req.body);
        const username = req.user?.name;
        const userId = req.user?._id;
        const newEvent = await Event.create({ ...validatedData, createdBy: userId, username: username });
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        next(error);
    }
};
