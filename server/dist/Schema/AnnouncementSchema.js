"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementSchema = void 0;
const zod_1 = require("zod");
exports.AnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string(),
});
