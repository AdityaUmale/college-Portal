import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { JwtConfig } from '../Config/config';

interface AuthenticatedRequest extends Request {
    user?: { _id: string; role: string, email: string, name: string };
}

export const isLoggedIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication failed: No token provided" });
        }
        const decodedToken: any = jwt.verify(token, JwtConfig.key);
        if (!decodedToken) {
            return res.status(401).json({ message: "Authentication failed: Invalid token" });
        }
        const { email, _id, role } = decodedToken;
        req.user = { _id, role, email, name: decodedToken.name };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed: Invalid token" });
    }
};
