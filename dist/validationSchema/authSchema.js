"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email({
        message: "Invalid email format"
    }),
    password: zod_1.z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.email({
        message: "Invalid email format"
    }),
    password: zod_1.z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
    name: zod_1.z.string().min(3, {
        message: "Name is required"
    }),
});
//# sourceMappingURL=authSchema.js.map