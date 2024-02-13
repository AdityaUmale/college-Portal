"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = void 0;
const zod_1 = require("zod");
exports.EventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string(),
    link: zod_1.z.string().url(),
});
