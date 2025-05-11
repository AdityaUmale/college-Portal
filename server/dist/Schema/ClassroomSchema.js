"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomSchema = void 0;
const zod_1 = require("zod");
exports.ClassroomSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string(),
});
