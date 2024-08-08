import { Request, Response } from 'express';
import User from '../Models/User';
import mongoose, { Schema } from 'mongoose';
import Classroom from '../Models/ClassRoom';
import { ClassroomSchema } from '../Schema/classroomSchema';
interface AuthenticatedRequest extends Request {
    user?: { _id: string; role: string, email: string, classrooms: string[], name: string };
}

export const getAllClassrooms = async (req: Request, res: Response, next: Function) => {
    try {
        const classrooms = await Classroom.find()
        .populate('members', 'name')
        .populate('pendingRequests._id', 'name')
        if (!Classroom || Classroom.length === 0) {
            return res.status(404).json({ message: 'No classrooms found' });
        }
        res.json(classrooms);
    } catch (error) {
        next(error);
    }
};

export const createClassroom = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const validatedData = ClassroomSchema.parse(req.body);
        const newClassroom = await Classroom.create({ ...validatedData, username: req.user?.name });
        if (req.user?.role !== "staff") {
            return res.status(403).json({ message: 'You are not authorized to create club' });
        }
        res.status(201).json({ message: 'Classroom created successfully', classroom: newClassroom });
    } catch (error) {
        next(error);
    }
};

export const applyClassroom = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
        const classroomId = req.params.id;
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        if (req.user?.role == "staff") {
            return res.status(405).json({ message: "Staff cannot join any classroom" })
        }
        const userToBeUpdated = await User.findById(req.user?._id);
        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (classroom.members.includes(userToBeUpdated._id)) {
            return res.status(400).json({ message: 'User is already in the classroom' });
          }
          if (classroom.pendingRequests.some(request => request._id && request._id.toString() === userToBeUpdated._id.toString())) {
            return res.status(400).json({ message: 'User has already requested to join this classroom' });
          }
          classroom.pendingRequests.push({ _id: userToBeUpdated._id, name: userToBeUpdated.name });
          await classroom.save();
          
          res.json({ message: 'Classroom join request sent successfully' });
        } catch (error) {
          next(error);
        }
      };

export const getClubMembers = async (req: Request, res: Response, next: Function) => {
    try {
      const classroomId = req.params.id;
      const classroom = await Classroom.findById(classroomId).populate('members', 'name');
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      res.json(classroom.members);
    } catch (error) {
      next(error);
    }
  };

  export const acceptClassroomRequest = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const classroomId = req.params.id;
      const userId = typeof req.params.userId === 'string' ? req.params.userId : JSON.parse(req.params.userId).id;
      
      const classroom = await Classroom.findById(classroomId);
      console.log('Found classroom:', classroom ? 'Yes' : 'No');

      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
        }
        console.log('Classroom pending requests:', JSON.stringify(classroom.pendingRequests));
      
      if (req.user?.role !== "staff") {
        return res.status(403).json({ message: 'You are not authorized to accept classroom requests' });
      }
      
      const pendingRequestIndex = classroom.pendingRequests.findIndex(request => request._id && request._id.toString() === userId);
      if (pendingRequestIndex === -1) {
        return res.status(404).json({ message: 'User request not found' });
      }
      console.log('Pending request index:', pendingRequestIndex);
      
      const acceptedUser = classroom.pendingRequests[pendingRequestIndex];
      classroom.pendingRequests.splice(pendingRequestIndex, 1);
      if (acceptedUser._id){
      classroom.members.push(acceptedUser._id);
      }
      classroom.strength += 1;
      await classroom.save();
      
      const user = await User.findById(userId);
      if (user) {
        user.clubs.push(classroom.name);
        await user.save();
      }
      
      res.json({ message: 'User request accepted successfully' });
    } catch (error) {
      next(error);
    }
  };

  export const deleteClassroom = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const classroomId = req.params.id;
  
      // Check if the user is staff
      if (req.user?.role !== "staff") {
        return res.status(403).json({ message: 'Only staff can delete clubs' });
      }
  
      // Find and delete the club
      const deletedClassroom = await Classroom.findByIdAndDelete(classroomId);
  
      if (!deletedClassroom) {
        return res.status(404).json({ message: 'Club not found' });
      }
  
      // Remove the club from all members' club lists
      await User.updateMany(

        { clubs: deletedClassroom.name },
        { $pull: { classrooms: deletedClassroom.name } }
      );
  
      res.json({ message: 'Classroom deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  export const removeClassroomMember = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const { userId } = req.params;
      const classroomId = req.params.id;
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) {
        return res.status(404).json({ message: 'Club not found' });
      }
      if (req.user?.role !== "staff") {
        return res.status(403).json({ message: 'Not authorized to remove members' });
      }
      classroom.members = classroom.members.filter(member => member.toString() !== userId);
      await classroom.save();
      await User.findByIdAndUpdate(userId, { $pull: { classrooms: classroom.name } });
      res.json({ message: 'Member removed successfully' });
    } catch (error) {
      next(error);
    }
  };


  export const revertClassroomApplication = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    try {
      const classroomId = req.params.id;
      const userId = req.user?._id;
  
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
  
      // Use the pull method to remove the matching request
      classroom.pendingRequests.pull({ _id: userId });
  
      await classroom.save();
  
      res.json({ message: 'Classroom application reverted successfully' });
    } catch (error) {
      next(error);
    }
  };