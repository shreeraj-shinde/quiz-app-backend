import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=authSchema.d.ts.map