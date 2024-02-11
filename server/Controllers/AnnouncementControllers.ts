import { Request, Response } from 'express';
import Announcement from '../Models/Announcement';
import { AnnouncementSchema } from '../Schema/AnnouncementSchema';

interface AuthenticatedRequest extends Request {
    user?: { _id: string; role: string, email: string };
}

export const getAllAnnouncements = async (req: Request, res: Response, next: Function) => {
    try {
        const announcements = await Announcement.find().sort({ _id: -1 });
        if (!announcements || announcements.length === 0) {
            return res.status(404).json({ message: 'No announcements found' });
        }
        res.json(announcements);
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncementById = async (req: Request, res: Response, next: Function) => {
    try {
        const announcementId = req.params.id;
        const deletedAnnouncement = await Announcement.findByIdAndDelete(announcementId);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.json({ message: 'Announcement deleted successfully', deletedAnnouncement });
    } catch (error) {
        next(error);
    }
};

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const validatedData = AnnouncementSchema.parse(req.body);
        const newAnnouncement = await Announcement.create({ ...validatedData, createdBy: req.user?._id });
        res.status(201).json({ message: 'Announcement created successfully', announcement: newAnnouncement });
    } catch (error) {
        next(error);
    }
};
