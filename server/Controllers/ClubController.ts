import { Request, Response } from 'express';
import Club from '../Models/Club';
import { ClubSchema } from '../Schema/ClubSchema';
import User from '../Models/User';
import mongoose, { Schema } from 'mongoose';
interface AuthenticatedRequest extends Request {
    user?: { _id: string; role: string, email: string, clubs: string[], name: string };
}

export const getAllClubs = async (req: Request, res: Response, next: Function) => {
    try {
        const clubs = await Club.find()
        .populate('members', 'name')
        .populate('pendingRequests._id', 'name')
        .populate('clubHeads', 'name');
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
        const newClub = await Club.create({ ...validatedData, clubHead: req.user?._id, username: req.user?.name });
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
        if (club.members.includes(userToBeUpdated._id)) {
            return res.status(400).json({ message: 'User is already in the club' });
          }
          if (club.pendingRequests.some(request => request._id && request._id.toString() === userToBeUpdated._id.toString())) {
            return res.status(400).json({ message: 'User has already requested to join this club' });
          }
          club.pendingRequests.push({ _id: userToBeUpdated._id, name: userToBeUpdated.name });
          await club.save();
          
          res.json({ message: 'Club join request sent successfully' });
        } catch (error) {
          next(error);
        }
      };

export const getClubMembers = async (req: Request, res: Response, next: Function) => {
    try {
      const clubId = req.params.id;
      const club = await Club.findById(clubId).populate('members', 'name');
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
      res.json(club.members);
    } catch (error) {
      next(error);
    }
  };

  export const acceptClubRequest = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const clubId = req.params.id;
      const userId = typeof req.params.userId === 'string' ? req.params.userId : JSON.parse(req.params.userId).id;

      console.log('Received request to accept. Club ID:', clubId, 'User ID:', userId);
      console.log('Request params:', req.params);
      console.log('Request body:', req.body);
      
      const club = await Club.findById(clubId);
      console.log('Found club:', club ? 'Yes' : 'No');

      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
        }
        console.log('Club pending requests:', JSON.stringify(club.pendingRequests));
      
      if (req.user?.role !== "staff" && req.user?._id.toString() !== club.clubHeads?.toString()) {
        return res.status(403).json({ message: 'You are not authorized to accept club requests' });
      }
      
      const pendingRequestIndex = club.pendingRequests.findIndex(request => request._id && request._id.toString() === userId);
      if (pendingRequestIndex === -1) {
        return res.status(404).json({ message: 'User request not found' });
      }
      console.log('Pending request index:', pendingRequestIndex);
      
      const acceptedUser = club.pendingRequests[pendingRequestIndex];
      club.pendingRequests.splice(pendingRequestIndex, 1);
      if (acceptedUser._id){
      club.members.push(acceptedUser._id);
      }
      club.strength += 1;
      await club.save();
      
      const user = await User.findById(userId);
      if (user) {
        user.clubs.push(club.name);
        await user.save();
      }
      
      res.json({ message: 'User request accepted successfully' });
    } catch (error) {
      next(error);
    }
  };

  export const deleteClub = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const clubId = req.params.id;
  
      // Check if the user is staff
      if (req.user?.role !== "staff") {
        return res.status(403).json({ message: 'Only staff can delete clubs' });
      }
  
      // Find and delete the club
      const deletedClub = await Club.findByIdAndDelete(clubId);
  
      if (!deletedClub) {
        return res.status(404).json({ message: 'Club not found' });
      }
  
      // Remove the club from all members' club lists
      await User.updateMany(
        { clubs: deletedClub.name },
        { $pull: { clubs: deletedClub.name } }
      );
  
      res.json({ message: 'Club deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  export const assignClubHead = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const { userId } = req.params;
      const clubId = req.params.id;
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
      if (req.user?.role !== "staff" && !club.clubHeads.some(head => head.toString() === req.user?._id)) {
        return res.status(403).json({ message: 'Not authorized to assign club head' });
      }
      if (!club.clubHeads.some(head => head.toString() === userId)) {
        club.clubHeads.push(new mongoose.Types.ObjectId(userId));
        await club.save();
      }
      const updatedClub = await Club.findById(clubId).populate('clubHeads', 'name');
      res.json({ message: 'Club head assigned successfully', clubHeads: updatedClub?.clubHeads });
    } catch (error) {
      next(error);
    }
  };

  export const removeMember = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const { userId } = req.params;
      const clubId = req.params.id;
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
      if (req.user?.role !== "staff" && !club.clubHeads.some(head => head.toString() === req.user?._id)) {
        return res.status(403).json({ message: 'Not authorized to remove members' });
      }
      club.members = club.members.filter(member => member.toString() !== userId);
      club.clubHeads = club.clubHeads.filter(head => head.toString() !== userId);
      await club.save();
      await User.findByIdAndUpdate(userId, { $pull: { clubs: club.name } });
      res.json({ message: 'Member removed successfully' });
    } catch (error) {
      next(error);
    }
  };

  export const removeClubHead = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const { userId } = req.params;
      const clubId = req.params.id;
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
      if (req.user?.role !== "staff") {
        return res.status(403).json({ message: 'Not authorized to remove club head' });
      }
      club.clubHeads = club.clubHeads.filter(head => head.toString() !== userId);
      await club.save();
      const updatedClub = await Club.findById(clubId).populate('clubHeads', 'name');
      res.json({ message: 'Club head removed successfully', clubHeads: updatedClub?.clubHeads });
    } catch (error) {
      next(error);
    }
  };

  export const revertClubApplication = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const clubId = req.params.id;
      const userId = req.user?._id;
  
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
  
      // Use the pull method to remove the matching request
      club.pendingRequests.pull({ _id: userId });
  
      await club.save();
  
      res.json({ message: 'Club application reverted successfully' });
    } catch (error) {
      next(error);
    }
  };