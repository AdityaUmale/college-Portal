import { Request, Response } from 'express';
import Event from '../Models/Event';
import { EventSchema } from '../Schema/EventSchema';

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
export const createEvent = async (req: Request, res: Response, next: Function) => {
    try {
        const validatedData = EventSchema.parse(req.body);
        const newEvent = await Event.create(validatedData);
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        next(error);
    }
};
