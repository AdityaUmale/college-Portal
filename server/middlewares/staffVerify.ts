import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    user?: { _id: string; role: string, email: string };
}

export const verifyStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "staff") {
        return res.status(403).json({ message: "You are not authorized to perform this action" });
    }
    next();
};