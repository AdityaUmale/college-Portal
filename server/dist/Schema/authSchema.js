"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const z = __importStar(require("zod"));
const loginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().max(20, {
        message: "Password shouldnt be that long ?",
    }),
});
exports.loginSchema = loginSchema;
const registerSchema = z.object({
    name: z.string().max(20, {
        message: "Name shouldnt be that long"
    }),
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/\d/, { message: "Password must contain at least one digit" })
        .regex(/[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]/, {
        message: "Password must contain at least one special character"
    }),
    role: z.enum(["user", "staff"]),
    clubs: z.array(z.string().min(1))
});
exports.registerSchema = registerSchema;
