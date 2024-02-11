import { Request, Response } from 'express';
import Club from '../Models/Club';
import { ClubSchema } from '../Schema/ClubSchema';
import User from '../Models/User';
interface AuthenticatedRequest extends Request {
    user?: { _id: string; role: string, email: string, clubs: [string] };
}

export const getAllClubs = async (req: Request, res: Response, next: Function) => {
    try {
        const clubs = await Club.find();
        if (!clubs || clubs.length === 0) {
            return res.status(404).json({ message: 'No clubs found' });
        }
        res.json(clubs);
    } catch (error) {
        next(error);
    }
};

export const createClub = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const validatedData = ClubSchema.parse(req.body);
        const newClub = await Club.create({ ...validatedData, clubHead: req.user?._id });
        if (req.user?.role !== "staff") {
            return res.status(403).json({ message: 'You are not authorized to create club' });
        }
        res.status(201).json({ message: 'Club created successfully', club: newClub });
    } catch (error) {
        next(error);
    }
};
export const applyClub = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const clubId = req.params.id;
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (req.user?.role == "staff") {
            return res.status(405).json({ message: "Staff cannot join any club" })
        }
        const userToBeUpdated = await User.findById(req.user?._id);
        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userToBeUpdated.clubs.includes(club.name!)) {
            return res.status(404).json({ message: 'User is already in the club' });
        }
        club.strength += 1;
        await club.save();
        userToBeUpdated.clubs.push(club.name!);
        await userToBeUpdated.save();

        res.json({ message: 'Club applied successfully' });
    } catch (error) {
        next(error);
    }
};

