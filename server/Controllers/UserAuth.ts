import express from "express";
import { loginSchema } from "../Schema/authSchema";
import User from "../Models/User";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JwtConfig } from "../Config/config";


const saltRounds = 10
const login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
    
        const { email, password } = req.body;
        const userData = { email, password };
        const validationResult = loginSchema.safeParse(userData);

        if (!validationResult.success) {
            return res.status(400).json({ error: validationResult.error });
        }

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordDB = foundUser.password;

        if (typeof passwordDB === 'string' && passwordDB.length > 0) {
            bcrypt.compare(password, passwordDB, function (err, result) {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                if (result) {
                    const token = jwt.sign({ email }, JwtConfig.key);
                    return res.status(200).json({ token });
                } else {
                    return res.status(401).json({ error: 'Invalid password' });
                }
            });
        }
    } catch (err) {
        next(err);
    }
};


const register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const { email, name, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        return  res.status(409).json({ message: "User with this email already present" })
    }
    let hashedPass = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash)
                    }

                });
            }
        })
    });

    User.create({
        name,
        email,
        password: hashedPass
    }).then((user: any) => {
        return res.status(200).json({ message: "User signup successfull" })
    }).catch((err) => {
      next(err)
    })



}

export { login, register }