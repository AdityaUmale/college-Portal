"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const authSchema_1 = require("../Schema/authSchema");
const User_1 = __importDefault(require("../Models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../Config/config");
const saltRounds = 10;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = { email, password };
        const validationResult = authSchema_1.loginSchema.safeParse(userData);
        if (!validationResult.success) {
            return res.status(400).json({ error: validationResult.error });
        }
        const foundUser = yield User_1.default.findOne({ email });
        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordDB = foundUser.password;
        if (typeof passwordDB === 'string' && passwordDB.length > 0) {
            bcrypt_1.default.compare(password, passwordDB, function (err, result) {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                if (result) {
                    const token = jsonwebtoken_1.default.sign({ email: foundUser.email, _id: foundUser._id, role: foundUser.role }, config_1.JwtConfig.key);
                    return res.status(200).json({ Authorization: "Bearer " + token });
                }
                else {
                    return res.status(401).json({ error: 'Invalid password' });
                }
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, role, clubs } = req.body;
    const user = yield User_1.default.findOne({ email: email });
    if (user) {
        return res.status(409).json({ message: "User with this email already present" });
    }
    let hashedPass = yield new Promise((resolve, reject) => {
        bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
            if (err) {
                reject(err);
            }
            else {
                bcrypt_1.default.hash(password, salt, function (err, hash) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(hash);
                    }
                });
            }
        });
    });
    User_1.default.create({
        name,
        email,
        password: hashedPass,
        role,
        clubs
    }).then((user) => {
        return res.status(200).json({ message: "User signup successfull" });
    }).catch((err) => {
        next(err);
    });
});
exports.register = register;
