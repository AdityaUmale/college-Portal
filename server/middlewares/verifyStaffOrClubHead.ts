// middlewares/verifyStaffOrClubHead.ts

import { NextFunction, Response } from "express";
import Club from '../Models/Club';  // Adjust the import path as necessary

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string, email: string };
}

export const verifyStaffOrClubHead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === "staff") {
    return next();
  }

  const clubId = req.params.clubId;
  const club = await Club.findById(clubId);

  if (!club) {
    return res.status(404).json({ message: "Club not found" });
  }

  if (club.clubHead.toString() === req.user?._id.toString()) {
    return next();
  }

  return res.status(403).json({ message: "You are not authorized to perform this action" });
};