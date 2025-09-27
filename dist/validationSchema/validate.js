"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                }))
            });
        }
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                }))
            });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map